import React, { Component } from 'react';
import { Button, Container } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';
import ResultsTable from './ResultsTableComponent';
import GraphQuery from './GraphQueryComponent';
import axios from 'axios';
import _ from 'lodash';

class AdvancedQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {},
      selectedEdgeID: "",
      loading: false,
      cy: {},
    };

    this.tableRef = React.createRef();
    this.graphRef = React.createRef();
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
        this.setState({selectedEdgeID: edge.data.id});
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

  //handle edge results
  edgeQuery(edge) {
    if (!_.isEmpty(this.state.response)) {
      this.tableRef.current.setTable(this.state.response, edge.id(), "edge");
    }
  }

  //handle node results
  nodeQuery(node) {
    if (!_.isEmpty(this.state.response)) {
      this.tableRef.current.setTable(this.state.response, node.id(), "node");
    }
  }

  // edgeQuery(edge) {
  //   console.log("Clicked", edge.id(), edge.source(), edge.target());
  //   let nodes = {};
  //   let edges = {};

  //   nodes[edge.source().id()] = {
  //     "id": edge.source().data.ids,
  //     "category": _.map(edge.source().data.categories, c => `biolink:${c}`)
  //   };

  //   nodes[edge.target().id()] = {
  //     "id": edge.target().data.ids,
  //     "category": _.map(edge.target().data.categories, c => `biolink:${c}`)
  //   }

  //   edges[edge.id()] = {
  //     "subject": edge.source().id(),
  //     "predicate": _.map(edge.target().data.categories, c => `biolink:${c}`)edge.data.predicates,
  //     "object": edge.target().id()
  //   };

  //   let query = {
  //     "message": {
  //       "query_graph": {
  //         "nodes": nodes,
  //         "edges": edges
  //       }
  //     }
  //   }
  //   console.log(query);
  //   axios.post('https://api.bte.ncats.io/v1/query', query).then((response) => {
  //     this.setState({loading: false, response: response.data});
  //     console.log("Response", response.data);
  //   }).catch((error) => {
  //     this.setState({loading: false});
  //     console.log("Error: ", error);
  //   });
  // }

  //get and query graph
  queryGraph() {
    let jsonGraph = this.graphRef.current.export();
    if (this.isValidQuery(jsonGraph)) {
      if (!this.state.loading) {
        this.tableRef.current.resetTable();
        this.setState({loading: true, cy: this.graphRef.current.getCy()});
        let query = this.convertJSONtoTRAPI(jsonGraph);

        console.log(query);

        axios.post('https://api.bte.ncats.io/v1/query', query).then((response) => {
          this.setState({loading: false, response: response.data});
          console.log("Response", response.data);
          this.tableRef.current.setTable(response.data, this.state.selectedEdgeID);
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
        <GraphQuery ref={this.graphRef} edgeQuery={this.edgeQuery.bind(this)} nodeQuery={this.nodeQuery.bind(this)} updateCy={this.updateCy.bind(this)}/>
        <Button onClick={this.queryGraph.bind(this)} loading={this.state.loading}>Query</Button>
        <ResultsTable ref={this.tableRef} cy={this.state.cy} updateCy={this.updateCy.bind(this)}/>
      </Container>
    )
  }
}

export default AdvancedQuery;