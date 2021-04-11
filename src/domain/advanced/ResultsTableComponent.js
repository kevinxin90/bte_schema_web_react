import _ from 'lodash';
import React, { Component } from 'react'
import { Table, Pagination, Checkbox, Icon, Popup, Accordion, Form, Button, Menu, Header, List } from 'semantic-ui-react'
import ResultsTableCell from './ResultsTableCellComponent';

export default class ResultsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      filteredResults: [],
      filter: {},
      filterOptions: {},
      table: {
        column: null,
        display: [],
        direction: null,
        activePage: 1,
        totalPages: 1
      },
      mode: "edge",
    }
  }

  resetTable() {
    this.setState({
      results: [],
      filteredResults: [],
      table: {
        column: null,
        display: [],
        direction: null,
        activePage: 1,
        totalPages: 1
      }
    });
  }

  setTable(response, selectedElementID, mode) {
    let results;
    if (mode === 'edge') {
      results = this.calculateTableGivenEdge(response, selectedElementID);
      this.setState({mode: "edge"});
    } else {
      results = this.calculateTableGivenNode(response, selectedElementID);
      this.setState({mode: "node"});
    }

    this.calculateFilters(results);

    this.setState({results: results, 
      filteredResults: results,
      table: {
        ...this.state.table,
        display: results.slice(0, 10),
        activePage: 1,
        totalPages: Math.ceil(results.length / 10)
      }
    });
  }

  calculateTableGivenNode(response, selectedNodeID) {
    let entries = [];
    let ids = new Set();
    response.message.results.forEach((result) => {
      if (result.node_bindings.hasOwnProperty(selectedNodeID)) {
        let nodeID = result.node_bindings[selectedNodeID][0].id;
        ids.add(nodeID);
      }
    });
    entries = _.map(Array.from(ids), (id) => ({node: response.message.knowledge_graph.nodes[id]}));
    return entries;
  }

  calculateTableGivenEdge(response, selectedEdgeID) {
    let entries = [];
    response.message.results.forEach((result) => {
      if (result.edge_bindings.hasOwnProperty(selectedEdgeID)) {
        let cy_edge = this.props.cy.getElementById(selectedEdgeID);
        let edge = response.message.knowledge_graph.edges[result.edge_bindings[selectedEdgeID][0].id]; //get knowledge graph edge
        let source = response.message.knowledge_graph.nodes[edge.subject];
        source.qg_id = cy_edge.source().id(); 
        let target = response.message.knowledge_graph.nodes[edge.object];
        target.qg_id = cy_edge.target().id(); 
        entries.push({source: source, edge: edge, target: target});
      }
    });

    return entries;
  }

  handlePaginationChange(e, {activePage}) {
    this.setState({
      table: {
          ...this.state.table,
          display: this.state.filteredResults.slice(activePage * 10 - 10, activePage * 10),
          activePage: activePage
      }
    });
  }

  //handle checkboxes and synchronize with graph
  handleSelect(e, { data }) {
    let node = this.props.cy.getElementById(data.qg_id);
    let entity_id = data.attributes[0].value[0];
    let idx = node.data('ids').indexOf(entity_id);
    if (idx === -1) {
      node.data('ids').push(entity_id);
    } else {
      node.data('ids').splice(idx, 1);
    }
    this.props.updateCy();
  }

  /*structure of filters
    [
      {source: obj, edge: obj, target: obj},
      etc.
    ] ->

    {
      source: 
        category: []
        name: []
        attribute:[]
      ,
      edge,
      target,
    }

  */
  calculateFilters(entries) {
    let temp = {};
    let filters  = {};
    let filterOptions = {};
    
    entries.forEach(entry => {
      Object.keys(entry).forEach(key => {
        temp[key] = (temp[key] || []).concat(entry[key]);
      });
    })

    Object.keys(temp).forEach(category => {
      filters[category] = {};
      filterOptions[category] = {};

      temp[category].forEach(element => {
        Object.keys(element).filter(key => (key !== 'qg_id')).forEach(key => { //ignore these fields
          if (key === 'attributes') {
            filters[category][key] = filters[category][key] || {};
            filterOptions[category][key] = filterOptions[category][key] || {};
            element.attributes.filter(attribute => (attribute.name !== 'source_qg_nodes' && attribute.name !== 'target_qg_nodes')).forEach(attribute => {//ignore these attribute fields
              filterOptions[category][key][attribute.name] = [];
              if (Array.isArray(attribute.value)) {
                filters[category][key][attribute.name] = new Set([...(filters[category][key][attribute.name] || []), ...(attribute.value)]);
              } else {
                filters[category][key][attribute.name] = new Set([...(filters[category][key][attribute.name] || []), ...([attribute.value])]);
              }
            });
          } else {
            filters[category][key] = (filters[category][key] || new Set()).add(element[key]);
            filterOptions[category][key] = [];
          }
        })
      });
    });

    this.setState({filters: filters, filterOptions: filterOptions});
    // return {filters: filters, filterOptions: filterOptions};
  }

  convertSetToFilterValue(set) {
    return Array.from(set).map(value => <div><Checkbox key={`checkbox-${_.uniqueId}`} label={value}/></div>);
  }

  getFilterPanels() {
    console.log(Object.entries(this.state.filters));

    let panels = Object.entries(this.state.filters).map(([key, value]) => {
      let nestedPanels = Object.entries(value).map(([nestedKey, nestedValue]) => {
        if (nestedKey === 'attributes') {
          let attributesPanels = Object.entries(nestedValue).map(([attributesKey, attributesValue]) => 
            ({ key: `panel-${_.uniqueId()}`, title: attributesKey, content: this.convertSetToFilterValue(attributesValue) }));

          let attributesContent = <div><Accordion.Accordion panels={attributesPanels}/></div>;
          return { key: `panel-${_.uniqueId()}`, title: nestedKey, content: { content: attributesContent} };
        } else {
          return { key: `panel-${_.uniqueId()}`, title: nestedKey, content: this.convertSetToFilterValue(nestedValue) };
        }
      });

      let nestedContent = <div><Accordion.Accordion panels={nestedPanels}/></div>;


      return { key: `panel-${_.uniqueId()}`, title: key, content: {content: nestedContent} };
    });

    console.log(panels);

    return panels;
  }

  render() {
    let tableContents;
    let table;

    if (this.state.results.length > 0) {
      if (this.state.mode === "edge") {
        tableContents = <>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>
                Add Source To Query Graph
              </Table.HeaderCell>
              <Table.HeaderCell width={2}>
                Source
              </Table.HeaderCell>
              <Table.HeaderCell width={2}>
                Edge
              </Table.HeaderCell>
              <Table.HeaderCell width={2}>
                Target
              </Table.HeaderCell>
              <Table.HeaderCell width={1}>
                Add Target To Query Graph
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(this.state.table.display, (entry) => {
              return (
                <Table.Row key={`row-${_.uniqueId()}`}>
                  <Table.Cell key={`checkbox-${_.uniqueId()}`} textAlign='center'>
                    <Checkbox onClick={this.handleSelect.bind(this)} 
                      data={entry.source} 
                      defaultChecked={this.props.cy.getElementById(entry.source.qg_id).data('ids').includes(entry.source.attributes[0].value[0])}
                    />
                  </Table.Cell>
                  <ResultsTableCell data={entry.source} type="node" />
                  <ResultsTableCell data={entry.edge} type="edge" />
                  <ResultsTableCell data={entry.target} type="node" />
                  <Table.Cell key={`checkbox-${_.uniqueId()}`} textAlign='center'>
                    <Checkbox onClick={this.handleSelect.bind(this)} 
                      data={entry.target} 
                      defaultChecked={this.props.cy.getElementById(entry.target.qg_id).data('ids').includes(entry.target.attributes[0].value[0])}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </>;
      } else {
        tableContents = <>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Nodes
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(this.state.table.display, (entry) => {
              return (
                <Table.Row key={`row-${_.uniqueId()}`}>
                  <ResultsTableCell data={entry.node} type="node"/>
                </Table.Row>
              );
            })}
          </Table.Body>
        </>;
      }
      
      table = <div style={{overflowX: "auto", marginBottom: "1em", marginTop: "0.5em"}}>
        <Popup 
          trigger={<Button content='Filter Results' icon='filter' labelPosition='left' />}
          flowing
          pinned
          position='bottom left'
          on='click'
          style={{padding: 0}}
        >
          <Accordion styled panels={this.getFilterPanels(this.state.results)}/>
        </Popup>
        <Table sortable unstackable celled>
          {tableContents}
        </Table>
        <Pagination
            onPageChange={this.handlePaginationChange.bind(this)}
            defaultActivePage={1}
            totalPages={this.state.table.totalPages}
            siblingRange={2}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }}
          />
      </div>;
    }
    
    return (
      <div style={{marginTop: "2rem"}}>
        <h3>Query Results</h3>
        {this.state.results.length > 0 ? table : <div>Make a query to see query results.</div>}
      </div>
    );
  }
};