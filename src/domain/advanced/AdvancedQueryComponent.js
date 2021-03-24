import React, { Component } from 'react';
import { Button, Container } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';
import GraphQuery from './GraphQueryComponent';
import axios from 'axios';
import _ from 'lodash';

class AdvancedQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: {}
    };
    this.childRef = React.createRef();
  }

  convertJSONtoTRAPI(jsonGraph) {
    let nodes = {};
    if (jsonGraph.elements.nodes) {
      jsonGraph.elements.nodes.forEach((node) => {
        nodes[node.data.id] = {
          "id": node.data.ids,
          "category": _.map(node.data.categories, c => `biolink:${c}`)
        }
      });
    }
    

    let edges = {};
    if (jsonGraph.elements.edges) {
      jsonGraph.elements.edges.forEach((edge) => {
        edges[edge.data.id] = {
          "subject": edge.data.source,
          "predicate": edge.data.predicates,
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

  getGraph() {
    let jsonGraph = this.childRef.current.export();
    let query = this.convertJSONtoTRAPI(jsonGraph);
    axios.post('https://api.bte.ncats.io/v1/query', query).then((response) => {
      console.log("Response", response, response.data);
    });
  }

  render() {
    return (
      <Container className="feature">
        <Navigation name="Advanced" />
        <GraphQuery ref={this.childRef} />
        <Button onClick={this.getGraph.bind(this)}>Query</Button>
      </Container>
    )
  }
}

export default AdvancedQuery;