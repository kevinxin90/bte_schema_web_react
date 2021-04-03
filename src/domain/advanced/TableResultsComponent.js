import _ from 'lodash';
import React, { Component } from 'react'
import { Table, Pagination, Checkbox, Icon, Popup, Accordion, Form, Button, Menu, Header } from 'semantic-ui-react'

export default class TableResultsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
      mode: "edge",
    }
  }

  setTable(response, selectedElementID, mode) {
    if (mode === 'edge') {
      this.setState({table: this.calculateTableGivenEdge(response, selectedElementID), mode: "edge"}, () => {
        console.log(this.state.table);
      });
    } else {
      this.setState({table: this.calculateTableGivenNode(response, selectedElementID), mode: "node"}, () => {
        console.log("NODE NEW TABLE", this.state.table);
      });
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
    console.log("NODE ENTRIES", ids, entries);
    return entries;
  }

  calculateTableGivenEdge(response, selectedEdgeID) {
    let entries = [];
    response.message.results.forEach((result) => {
      if (result.edge_bindings.hasOwnProperty(selectedEdgeID)) {
        let edge = response.message.knowledge_graph.edges[result.edge_bindings[selectedEdgeID][0].id]; //get knowledge graph edge
        let source = response.message.knowledge_graph.nodes[edge.subject];
        let target = response.message.knowledge_graph.nodes[edge.object];
        console.log(source, edge, target);
        entries.push({source: source, edge: edge, target: target});
      }
    });
    return entries;
  }

  render() {
    let table;

    if (this.state.mode === "edge") {
      table = <div style={{overflowX: "auto", marginBottom: "1em", marginTop: "0.5em"}}> 
        <Table sortable unstackable celled compact>
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
            {_.map(this.state.table, (entry) => {
              return (
                <Table.Row>
                  <Table.Cell>
                    {entry.source.name}
                  </Table.Cell>
                  <Table.Cell>
                    {entry.edge.predicate}
                  </Table.Cell>
                  <Table.Cell>
                    {entry.target.name}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>;
    } else {
      table = <div style={{overflowX: "auto", marginBottom: "1em", marginTop: "0.5em"}}> 
        <Table sortable unstackable celled compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Nodes
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(this.state.table, (entry) => {
              console.log(entry);
              return (
                <Table.Row>
                  <Table.Cell>
                    {entry.node.name}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>;
    }
    

    return (
      <div style={{marginTop: "2rem"}}>
        <h3>Query Results</h3>
        {this.state.table.length > 0 ? table : <div>Make a query to see query results.</div>}
      </div>
    );
  }
};