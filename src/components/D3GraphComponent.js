import { Graph } from "react-d3-graph";
import React from 'react';
 
export default function D3Graph({graph}) {

    // graph payload (with minimalist structure)
    
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
            "size": 50,
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
    return <Graph
            id="d3-graph" // id is mandatory, if no id is defined rd3g will throw an error
            data={graph}
            config={myConfig}
            />
}