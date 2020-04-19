import React, { useEffect } from 'react';
import {colorSchema, semanticTypeShorthand} from '../shared/semanticTypes'
import * as d3 from 'd3';
import _ from 'lodash';

const Labels = () => {
    useEffect(() => {
        draw()
    }, [])
    return <div className='node-label' />
}

const draw = () => {
    let svg = d3.select('.node-label').append('svg')
                .attr('height', "150px")
                .attr('width', "100%")
                .attr('id', 'svg-viz-node-label')

    const fullName = _.invert(semanticTypeShorthand);

    const dataArray = Object.keys(colorSchema);

    svg.selectAll("circle")
        .data(dataArray)
        .enter().append("circle")
                    .attr("r", "10")
                    .attr("cx", (d, i) => (i%4)*160 + 10)
                    .attr("cy", (d, i) => Math.floor(i/4) * 30 + 10)
                    .attr("fill", (d) => colorSchema[d])

    function drawOneLabel(label, index) {


        svg.append("text")
            .attr("x", (index%4)*160 + 10)
            .attr("y", Math.floor(index/4) * 30 + 10)
            .attr("stroke", "white")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "10")
            .text(label)
        
        svg.append("text")
            .attr("x", (index%4)*160 + 40)
            .attr("y", Math.floor(index/4) * 30 + 10)
            .attr("stroke", "black")
            .attr("text-anchor", "start")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "10")
            .text(fullName[label])
    }

    for (let i = 0; i < dataArray.length; i++) {
        drawOneLabel(dataArray[i], i)
    }
}

export default Labels
