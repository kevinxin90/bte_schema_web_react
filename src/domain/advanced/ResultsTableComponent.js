import _ from 'lodash';
import React, { Component } from 'react'
import { Table, Pagination, Checkbox, Icon, Popup, Accordion, Dropdown, Button } from 'semantic-ui-react'
import ResultsTableCell from './ResultsTableCellComponent';

export default class ResultsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [], 
      filteredResults: [],
      filter: {}, //all possible filter values
      selectedFilters: {}, //current filter selections
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

  //from response get results and filters
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

  //flatten attributes to same level as other properties of an object
  flattenElement(element) {
    let flattened = {};
    Object.keys(element).forEach((key) => {
      if (key === 'attributes') {
        element.attributes.forEach(attr => {
          flattened[attr.name] = attr.value;
        })
      } else {
        flattened[key] = element[key];
      }
    })

    return flattened;
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
    entries = _.map(Array.from(ids), (id) => ({node: this.flattenElement(response.message.knowledge_graph.nodes[id])}));
    return entries;
  }

  calculateTableGivenEdge(response, selectedEdgeID) {
    let entries = [];
    response.message.results.forEach((result) => {
      if (result.edge_bindings.hasOwnProperty(selectedEdgeID)) {
        let cy_edge = this.props.cy.getElementById(selectedEdgeID);
        let edge = this.flattenElement(response.message.knowledge_graph.edges[result.edge_bindings[selectedEdgeID][0].id]); //get knowledge graph edge
        let source = this.flattenElement(response.message.knowledge_graph.nodes[edge.subject]);
        source.qg_id = cy_edge.source().id(); 
        let target = this.flattenElement(response.message.knowledge_graph.nodes[edge.object]);
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

  //handle checkbox select and synchronize with graph
  handleSelect(e, { data }) {
    let node = this.props.cy.getElementById(data.qg_id);
    let entity_id = data.equivalent_identifiers[0];
    let idx = node.data('ids').indexOf(entity_id);
    if (idx === -1) {
      node.data('ids').push(entity_id);
    } else {
      node.data('ids').splice(idx, 1);
    }
    this.props.updateCy();
  }

  //from an array of entries, calculate the properties that can be filtered by
  calculateFilters(entries) {
    let temp = {};
    let filters  = {};
    let selectedFilters = {};
    
    entries.forEach(entry => {
      Object.keys(entry).forEach(key => {
        temp[key] = (temp[key] || []).concat(entry[key]);
      });
    })

    Object.keys(temp).forEach(category => {
      filters[category] = {};
      selectedFilters[category] = {};

      temp[category].forEach(element => {
        Object.keys(element).filter(key => (key !== 'qg_id' &&
          key !== 'source_qg_nodes' && 
          key !== 'target_qg_nodes' && 
          key !== 'equivalent_identifiers')
        ).forEach(key => { //ignore these fields
          if (Array.isArray(element[key])) {
            filters[category][key] = new Set([...(filters[category][key] || []), ...(element[key])]);
          } else {
            filters[category][key] = (filters[category][key] || new Set()).add(element[key]);
          }

          selectedFilters[category][key] = new Set();
          
        })
      });
    });

    this.setState({filters: filters, selectedFilters: selectedFilters});
  }

  //using the selected filters, filter results and update filteredResults
  filterResults() {
    let filteredResults = this.state.results.filter((obj) => {
      for (const key of Object.keys(obj)) {
        for (const k of Object.keys(this.state.selectedFilters[key])) {
          if (obj[key].hasOwnProperty(k) && this.state.selectedFilters[key][k].size > 0) {
            if (Array.isArray(obj[key][k])) { //return false for entry if no array values are in the set
              let hasValueInSet = false;
              for (const val of obj[key][k]) {
                if (this.state.selectedFilters[key][k].has(val)) {
                  hasValueInSet = true;
                }
              }
              if (!hasValueInSet) {
                return false;
              }
            } else {
              if (!this.state.selectedFilters[key][k].has(obj[key][k])) {
                return false;
              }
            }
          }
        }
      }
      return true;
    });

    this.setState({
      filteredResults: filteredResults, 
      table: {
        ...this.state.table,
        display: filteredResults.slice(0, 10),
        activePage: 1,
        totalPages: Math.ceil(filteredResults.length / 10)
      }
      
    });
  }

  //update selected filters when dropdown/checkbox is clicked/selected
  updateFilters(e, data ) {
    if (data.hasOwnProperty('value')) { //handle multiselect dropdown
      let selectedFilters = this.state.selectedFilters;
      selectedFilters[data.data.objectName][data.data.key] = new Set(data.value);
      this.setState({selectedFilters: selectedFilters});
    } else { //handle checkbox
      let selectedFilters = this.state.selectedFilters;
      if (selectedFilters[data.data.objectName][data.data.key].has(data.label)) {
        selectedFilters[data.data.objectName][data.data.key].delete(data.label);
      } else {
        selectedFilters[data.data.objectName][data.data.key].add(data.label);
      }
      this.setState({selectedFilters: selectedFilters});
    }
    this.filterResults();
  }

  //convert one selectedFilters parameter (which is a set) into a display section for the filter
  convertSetToFilterValue(set, objectName, key) {
    let attribute_values = Array.from(set);
    if (attribute_values.length > 5) {
      let options = attribute_values.map((value) => ({key: value, text: value, value: value}));
      return <div><Dropdown multiple search selection options={options} value={Array.from(this.state.selectedFilters[objectName][key])} onChange={this.updateFilters.bind(this)} data={{objectName: objectName, key: key}}/></div>;
    } else {
      return <div>{attribute_values.map(value => <div><Checkbox key={`checkbox-${_.uniqueId}`} label={value} checked={this.state.selectedFilters[objectName][key].has(value)} onClick={this.updateFilters.bind(this)} data={{objectName: objectName, key: key}}/></div>)}</div>;
    }
  }

  //visual filter accordion panels
  getFilterPanels() {
    let panels = Object.entries(this.state.filters).map(([key, value]) => {
      let nestedPanels = Object.entries(value).map(([nestedKey, nestedValue]) => {
        return { key: `panel-${nestedKey}`, title: nestedKey, content: { content: this.convertSetToFilterValue(nestedValue, key, nestedKey) }};
      });

      let nestedContent = <div><Accordion.Accordion panels={nestedPanels}/></div>;

      return { key: `panel-${key}`, title: key, content: {content: nestedContent} };
    });

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
                      defaultChecked={this.props.cy.getElementById(entry.source.qg_id).data('ids').includes(entry.source.equivalent_identifiers[0])}
                    />
                  </Table.Cell>
                  <ResultsTableCell data={entry.source} type="node" />
                  <ResultsTableCell data={entry.edge} type="edge" />
                  <ResultsTableCell data={entry.target} type="node" />
                  <Table.Cell key={`checkbox-${_.uniqueId()}`} textAlign='center'>
                    <Checkbox onClick={this.handleSelect.bind(this)} 
                      data={entry.target} 
                      defaultChecked={this.props.cy.getElementById(entry.target.qg_id).data('ids').includes(entry.target.equivalent_identifiers[0])}
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