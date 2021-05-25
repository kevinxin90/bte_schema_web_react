import React, { Component } from 'react';
import { Button, Header, Container, Modal } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';
import ResultsTable from './table/ResultsTableComponent';
import GraphQuery from './graph/GraphQueryComponent';
import axios from 'axios';
import _ from 'lodash';

class AdvancedQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {},
      tableEntries: [],
      selectedElementID: "",
      mode: "",
      loading: false,
      modalOpen: false,
      TRAPIQuery: {},
      cy: {},
    };

    this.graphRef = React.createRef();

    this.updateCy = this.updateCy.bind(this);
    this.edgeQuery = this.edgeQuery.bind(this);
    this.nodeQuery = this.nodeQuery.bind(this);
    this.defaultQuery = this.defaultQuery.bind(this);
    this.setElementID = this.setElementID.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.calculateCurrentTRAPIQuery = this.calculateCurrentTRAPIQuery.bind(this);
  } 

  calculateCurrentTRAPIQuery() {
    let jsonGraph = this.graphRef.current.export();
    let query = this.convertJSONtoTRAPI(jsonGraph);
    this.setState({TRAPIQuery: JSON.stringify(query, null, 2)});
  }

  handleModalOpen() {
    this.setState({modalOpen: true});
  }

  handleModalClose() {
    this.setState({modalOpen: false});
  }

  setElementID(id) {
    if (this.state.response.message && this.state.response.message.results.length > 0) {
      this.setState({
        selectedElementID: id
      })
      this.graphRef.current.setSelectedElementID(id);
    } else {
      console.log("No results.");
    }
  }

  //at least 1 node must have an id
  //has at least 1 edge
  isValidQuery(jsonGraph) {
    if (!(jsonGraph.elements.edges && jsonGraph.elements.edges.length >= 1)) {
      alert("Must have at least 1 edge.");
      return false;
    } 
    for (let node of jsonGraph.elements.nodes) {
      if (node.data.ids.length > 0) {
        return true;
      }
    }
    alert("Must have at least 1 node with an id.");
    return false;
  }

  //convert cytoscape json export to TRAPI query syntax
  convertJSONtoTRAPI(jsonGraph) {
    let nodes = {};
    if (jsonGraph.elements.nodes) {
      jsonGraph.elements.nodes.forEach((node) => {
        nodes[node.data.id] = {
          "id": node.data.ids,
          "category": _.map(node.data.categories, category => `biolink:${category}`)
        }
      });
    }

    let edges = {};
    if (jsonGraph.elements.edges) {
      jsonGraph.elements.edges.forEach((edge) => {
        let pred = _.map(edge.data.predicates, predicate => `biolink:${predicate}`);
        edges[edge.data.id] = {
          "subject": edge.data.source,
          "predicate": pred.length ? pred : undefined,
          "object": edge.data.target
        };
      });
    }

    return {
      "message": {
        "query_graph": {
          "nodes": nodes,
          "edges": edges
        }
      }
    }
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

    //get all ids associated with node
    response.message.results.forEach((result) => {
      if (result.node_bindings.hasOwnProperty(selectedNodeID)) {
        let nodeID = result.node_bindings[selectedNodeID][0].id;
        ids.add(nodeID);
      }
    });

    //get the data from the knowledge graph for those ids
    entries = _.map(Array.from(ids), (id) => {
      let entry = {node: this.flattenElement(response.message.knowledge_graph.nodes[id])};
      entry.node.entity_id = id;
      entry.node.qg_id = selectedNodeID;
      return entry;
    });
    return entries;
  }

  calculateTableGivenEdge(response, selectedEdgeID) {
    let entries = [];

    //get all results that are related to the edge then flatten them to the desired shape
    response.message.results.forEach((result) => {
      if (result.edge_bindings.hasOwnProperty(selectedEdgeID)) {
        let cy_edge = this.state.cy.getElementById(selectedEdgeID);

        let edge = this.flattenElement(response.message.knowledge_graph.edges[result.edge_bindings[selectedEdgeID][0].id]); //get knowledge graph edge
        
        let source = this.flattenElement(response.message.knowledge_graph.nodes[edge.subject]);
        source.entity_id = edge.subject;
        source.qg_id = cy_edge.source().id(); 

        let target = this.flattenElement(response.message.knowledge_graph.nodes[edge.object]);
        target.entity_id = edge.object;
        target.qg_id = cy_edge.target().id(); 

        entries.push({source: source, edge: edge, target: target});
      }
    });

    return entries;
  }


  //handle edge results
  edgeQuery(edge) {
    if (!_.isEmpty(this.state.response)) {
      this.setState({
        tableEntries: this.calculateTableGivenEdge(this.state.response, edge.id()),
        mode: "edge"
      }, () => this.setElementID(edge.id()));
      
    } else {
      this.queryGraph(() => {
        this.setState({
          tableEntries: this.calculateTableGivenEdge(this.state.response, edge.id()),
          mode: "edge"
        }, () => this.setElementID(edge.id()));
      });
      
    }
  }

  //handle node results
  nodeQuery(node) {
    if (!_.isEmpty(this.state.response)) {
      this.setState({
        tableEntries: this.calculateTableGivenNode(this.state.response, node.id()),
        mode: "node"
      }, () => this.setElementID(node.id()));
    } else {
      this.queryGraph(() => {
        this.setState({
          tableEntries: this.calculateTableGivenNode(this.state.response, node.id()),
          mode: "node"
        }, () => this.setElementID(node.id()));
      }); 
    }
  }

  //open results for first edge by default
  defaultQuery() {
    let edgeID;
    if (this.graphRef.current.getCy().edges().length > 0) {
      edgeID = this.graphRef.current.getCy().edges()[0].id();
    }
    this.queryGraph(() => {
      this.setState({
        tableEntries: this.calculateTableGivenEdge(this.state.response, edgeID),
        mode: "edge"
      });
      this.setElementID(edgeID);
    })
  }

  //get and query graph
  queryGraph(callback) { //pass optional callback function that executes after response is recieved
    let jsonGraph = this.graphRef.current.export();
    if (this.isValidQuery(jsonGraph)) {
      if (!this.state.loading) {
        this.setState({loading: true, cy: this.graphRef.current.getCy()});
        let query = this.convertJSONtoTRAPI(jsonGraph);

        axios.post('https://api.bte.ncats.io/v1/query', query).then((response) => {
          this.setState({loading: false, response: response.data}, () => {
            callback();
          });
          console.log("Response", response.data);
        }).catch((error) => {
          this.setState({loading: false});
          console.log("Error: ", error);
        });
      } else {
        console.log('Already loading.');
      }
    }
  }

  //update cytoscape object in state
  //needed for checkbox sync with graph
  updateCy() {
    this.setState({cy: this.graphRef.current.getCy()});
  }

  render() {
    return (
      <Container className="feature">
        <Navigation name="Advanced" />
        <GraphQuery ref={this.graphRef} edgeQuery={this.edgeQuery} nodeQuery={this.nodeQuery} updateCy={this.updateCy}/>
        <Button onClick={this.defaultQuery} loading={this.state.loading}>Query</Button>
        <Modal
          closeIcon
          open={this.state.modalOpen}
          trigger={<Button onClick={this.calculateCurrentTRAPIQuery}>View TRAPI Query</Button>}
          onClose={this.handleModalClose}
          onOpen={this.handleModalOpen}
        >
          <Header>Current TRAPI Query</Header>
          <Modal.Content>
            <p style={{"whiteSpace": "pre-wrap"}}>
              {this.state.TRAPIQuery}
            </p>
          </Modal.Content>
        </Modal>
        <ResultsTable 
          results={this.state.tableEntries} 
          selectedElementID={this.state.selectedElementID} 
          mode={this.state.mode} 
          cy={this.state.cy} 
          updateCy={this.updateCy}
          key={this.state.selectedElementID}
        />
      </Container>
    )
  }
}

export default AdvancedQuery;