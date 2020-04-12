import React, { useEffect } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const Viz = () => {
  useEffect(() => {
   draw()
 }, [2])
  return <div className='node-label' />
}

const draw = () => {
    let svg = d3.select('.node-label').append('svg')
                .attr('height', "150px")
                .attr('width', "100%")
                .attr('id', 'svg-viz-node-label')

    const color = {
        G: '#02b3e4',
        SV: "#e91e63", 
        CS: '#fa750f',
        PF: '#1b03fc',
        PW: '#607d8b',
        T: '#7d4d3e',
        A: '#4caf50',
        GF: "#e11F63",
        P: "#f21e37",
        CL: '#175442',
        BS: '#815499',
        D: '#7761f2',
        C: '#d8e339',
        CC: '#3107d9',
        BP: '#236b44',
        MA: '#0366fc',
    }

    const shorthand = {
        Gene: "G",
        SequenceVariant: "SV",
        ChemicalSubstance: "CS",
        PhenotypicFeature: "PF",
        Pathway: "PW",
        Transcript: "T",
        AnatomicalEntity: "A",
        GeneFamily: "GF",
        Protein: "P",
        CellLine: "CL",
        Biosample: "BS",
        DiseaseOrPhenotypicFeature: "D",
        Cell: "C",
        CellularComponent: "CC",
        BiologicalProcess: "BP",
        MolecularActivity: "MA"
    }

    const fullName = _.invert(shorthand);

    const dataArray = Object.keys(color);

    svg.selectAll("circle")
        .data(dataArray)
        .enter().append("circle")
                    .attr("r", "10")
                    .attr("cx", (d, i) => (i%4)*160 + 10)
                    .attr("cy", (d, i) => Math.floor(i/4) * 30 + 10)
                    .attr("fill", (d) => color[d])

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
export default Viz
