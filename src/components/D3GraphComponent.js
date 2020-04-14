import { Graph } from "react-d3-graph";
import React, { Component } from 'react';


 
 
export default class D3Graph extends Component {

    render() {
        // graph payload (with minimalist structure)
        const data = {
            nodes: [{ id: "Harry", x: 30, y: 200, color: 'red' }, { id: "Sally", x: 360 }, { id: "kevin", x: 360 }, { id: "Alice", x: 700, y:200, color: 'green' }],
            links: [{ source: "Harry", target: "Sally", label: 'A-B' }, { source: "Harry", target: "kevin", label: 'A-B' }, { source: "Sally", target: "Alice", label: 'B-C' }, { source: "kevin", target: "Alice", label: 'B-C' }],
        };
        
        // the graph configuration, you only need to pass down properties
        // that you want to override, otherwise default ones will be used
        const myConfig = {
            "automaticRearrangeAfterDropNode": false,
            "collapsible": false,
            "directed": true,
            "focusAnimationDuration": 0.75,
            "focusZoom": 1,
            "height": 400,
            "highlightDegree": 1,
            "highlightOpacity": 1,
            "linkHighlightBehavior": true,
            "maxZoom": 8,
            "minZoom": 0.1,
            "nodeHighlightBehavior": true,
            "panAndZoom": false,
            "staticGraph": false,
            "staticGraphWithDragAndDrop": true,
            "width": 800,
            "d3": {
              "alphaTarget": 0.1,
              "gravity": -200,
              "linkLength": 200,
              "linkStrength": 1,
              "disableLinkForce": true
            },
            "node": {
              "color": "#d3d3d3",
              "fontColor": "black",
              "fontSize": 12,
              "fontWeight": "normal",
              "highlightColor": "SAME",
              "highlightFontSize": 12,
              "highlightFontWeight": "bold",
              "highlightStrokeColor": "blue",
              "highlightStrokeWidth": "SAME",
              "labelProperty": "name",
              "mouseCursor": "pointer",
              "opacity": 1,
              "renderLabel": true,
              "size": 500,
              "strokeColor": "none",
              "strokeWidth": 2,
              "svg": "",
              "symbolType": "circle"
            },
            "link": {
              "color": "#d3d3d3",
              "fontColor": "black",
              "fontSize": 12,
              "fontWeight": "normal",
              "highlightColor": "blue",
              "highlightFontSize": 8,
              "highlightFontWeight": "bold",
              "labelProperty": "label",
              "mouseCursor": "pointer",
              "opacity": 1,
              "renderLabel": true,
              "semanticStrokeWidth": true,
              "strokeWidth": 1.5,
              "markerHeight": 6,
              "markerWidth": 6
            }
          };
        return (
        <Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={this.props.graph}
            config={myConfig}
        />
        )
    }
}