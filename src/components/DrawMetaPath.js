import React, { useEffect } from 'react';
import {colorSchema, semanticTypeShorthand} from '../shared/semanticTypes'
import * as d3 from 'd3';

const DrawMetaPaths = (props) => {
    useEffect(() => {
        draw(props)
    }, [])
    return <div className={props.className} />
}

const draw = (props) => {
    let svg = d3.select('.' + props.className).append('svg')
                .attr('height', "20px")
                .attr('width', "100%")
                .attr('id', 'svg-viz-' + props.className)

    let dataArray = props.path.split('-').map(item => semanticTypeShorthand[item]);

    svg.selectAll("circle")
        .data(dataArray.slice(1, 2))
        .enter().append("circle")
        .attr("r", "10")
        .attr("cx", "95")
        .attr("cy", "10")
        .attr("fill", (d) => colorSchema[d])
    
    
    svg.selectAll("line")
        .data(dataArray.slice(0, dataArray.length -1))
        .enter().append("line")
        .attr("x1", (d, i) => 80*i + 30)
        .attr("y1", "10")
        .attr("y2", "10")
        .attr("width", 10)
        .attr("x2", (d, i) => 80*i + 80)
        .attr("stroke", "#ded9d3")
        .attr("stroke-width", "1")

        
    svg.append("text")
        .attr("x", 12)
        .attr("y", 10)
        .attr("stroke", "black")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "10")
        .text("Input")

    svg.append("text")
        .attr("x", 180)
        .attr("y", 10)
        .attr("stroke", "black")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "10")
        .text("Output")

    svg.append("text").selectAll("tspan")
        .data(dataArray.slice(1, 2))
        .enter().append("tspan")
        .attr("x", "95")
        .attr("y", 10)
        .attr("stroke", "white")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "10")
        .text((d) => d)

  }
export default DrawMetaPaths
