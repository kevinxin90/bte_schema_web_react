import _ from 'lodash';
import React, { Component } from 'react'
import { Table, Pagination, Checkbox, Icon, Popup, Accordion, Form, Button, Menu, Header, List } from 'semantic-ui-react'
import { getPublicationLink } from '../../shared/utils';

export default class TableResultsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      filteredResults: [],
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

  setTable(response, selectedElementID, mode) {
    if (mode === 'edge') {
      let results = this.calculateTableGivenEdge(response, selectedElementID);
      this.setState({results: results, 
        filteredResults: results,
        table: {
          ...this.state.table,
          display: results.slice(0, 10),
          activePage: 1,
          totalPages: Math.ceil(results.length / 10)
        }, 
        mode: "edge"});
    } else {
      let results = this.calculateTableGivenNode(response, selectedElementID);
      this.setState({results: results, 
        filteredResults: results,
        table: {
          ...this.state.table,
          display: results.slice(0, 10),
          activePage: 1,
          totalPages: Math.ceil(results.length / 10)
        }, 
        mode: "node"});
    }
    
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
        let edge = response.message.knowledge_graph.edges[result.edge_bindings[selectedEdgeID][0].id]; //get knowledge graph edge
        let source = response.message.knowledge_graph.nodes[edge.subject];
        let target = response.message.knowledge_graph.nodes[edge.object];
        entries.push({source: source, edge: edge, target: target});
      }
    });
    return entries;
  }

  getAttributesContent(attributes) {
    return (
      <List>
        {_.map(attributes, (attribute) => {
          if (attribute.name === 'publications') {
            return (
              <List.Item>
                <List.Content>Publications</List.Content>
                <List.Description as='a' href={getPublicationLink(attribute.value)} target="_blank" rel="noopener noreferrer">
                  Open All Publications({attribute.value.length})&nbsp;<Icon name='external alternate' color='grey' fitted size='small'/>
                </List.Description>
              </List.Item>
            );
          } else if (Array.isArray(attribute.value)) {
            let panel = [{
              key: `accordion-${_.uniqueId()}`,
              title: {
                children:(
                /*add your icon and/or styles here*/
                  <span>
                    {attribute.name}&nbsp;<Icon name='plus' size='small'/>
                  </span>
                )
              },
              content: {
                content: (
                  <List.Description>
                    <List items={attribute.value}/>
                  </List.Description>
                )
              }
            }]
            return (
              <List.Item>
                <List.Content><Accordion panels={panel}/></List.Content>
              </List.Item>
            )
          } else {
            return (
              <List.Item>
                <List.Content>{attribute.name}</List.Content>
                <List.Description>
                  {attribute.value}
                </List.Description>
              </List.Item>
            )
          }
        })}
      </List>
    )
  }

  getNodeCell(node) {
    return (
      <Popup on='click' trigger={
        <Table.Cell style={{cursor: 'pointer'}}>
          {node.name}
        </Table.Cell>
      }>
        <Popup.Header>
          <Header as='h3'>
            {node.name}
            <Header.Subheader>
              {node.category}
            </Header.Subheader>
          </Header>
        </Popup.Header>
        <Popup.Content>
          {this.getAttributesContent(node.attributes)}
        </Popup.Content>
      </Popup> 
    )
  }

  getEdgeCell(edge) {
    return (
      <Popup on='click' trigger={
        <Table.Cell style={{cursor: 'pointer'}}>
          {edge.predicate}
        </Table.Cell>
      }>
        <Popup.Header>
          <Header as='h3'>
            {edge.predicate}
            <Header.Subheader>
              {edge.subject} &#8594; {edge.object}
            </Header.Subheader>
          </Header>
        </Popup.Header>
        <Popup.Content>
          {this.getAttributesContent(edge.attributes)}
        </Popup.Content>
      </Popup> 
    )
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

  render() {
    let tableContents;

    if (this.state.mode === "edge") {
      tableContents = <>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              Source
            </Table.HeaderCell>
            <Table.HeaderCell>
              Edge
            </Table.HeaderCell>
            <Table.HeaderCell>
              Target
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(this.state.table.display, (entry) => {
            return (
              <Table.Row key={`row-${_.uniqueId()}`}>
                {this.getNodeCell(entry.source)}
                {this.getEdgeCell(entry.edge)}
                {this.getNodeCell(entry.target)}
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
                {this.getNodeCell(entry.node)}
              </Table.Row>
            );
          })}
        </Table.Body>
      </>;
    }
    
    let table = <div style={{overflowX: "auto", marginBottom: "1em", marginTop: "0.5em"}}> 
      <Table sortable unstackable celled compact>
        {tableContents}
      </Table>
      <Pagination
          onPageChange={this.handlePaginationChange.bind(this)}
          defaultActivePage={1}
          totalPages={this.state.table.totalPages}
          siblingRange={2}
        />
    </div>;

    return (
      <div style={{marginTop: "2rem"}}>
        <h3>Query Results</h3>
        {this.state.results.length > 0 ? table : <div>Make a query to see query results.</div>}
      </div>
    );
  }
};