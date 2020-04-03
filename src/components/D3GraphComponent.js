import React, { Component } from "react";
import { Graph } from "react-d3-graph";
import RenderTable from "./TableComponent";
 

export default class D3Graph extends Component {

  render() {
    // graph payload (with minimalist structure)

    // the graph configuration, you only need to pass down properties
    // that you want to override, otherwise default ones will be used
    const myConfig = {
      nodeHighlightBehavior: true,
      node: {
          color: "lightgreen",
          size: 80,
          highlightStrokeColor: "blue",
      },
      link: {
          color: "#d3d3d3",
          fontColor: "black",
          highlightColor: "lightblue",
          labelProperty: "label",
          fontSize: 8,
          opacity: 1,
          renderLabel: true,
      },
      width: 1000,
      height: 500
  };

  const renderGraph = () => (
    <div>
        <h3>Graph</h3>
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={this.props.graph}
          config={myConfig}
        />
    </div>
  )
  return (
    this.props.resultReady ? renderGraph(): null
  )}   
}
