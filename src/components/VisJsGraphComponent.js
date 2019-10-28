import Graph from "react-graph-vis";
// import Graph from "../../lib";

// import Graph from 'react-graph-vis'

import React, { Component } from "react";
import { render } from "react-dom";

export default class VisJsGraph extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const graph = {
      nodes: this.props.nodes,
      edges: this.props.edges
    };

    const options = {
      layout: {
        hierarchical: false
      },
      edges: {
        color: "#000000"
      }
    };

    const events = {
      select: function(event) {
        var { nodes, edges } = event;
        console.log("Selected nodes:");
        console.log(nodes);
        console.log("Selected edges:");
        console.log(edges);
      }
    };
    return (
      <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
    )
  }
    
}
