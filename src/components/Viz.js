import React, { useEffect } from 'react';
import * as d3 from 'd3';

const Viz = (props) => {
  useEffect(() => {
   draw(props)
 }, [0])
  return <div className={props.className} />
}

const draw = (props) => {
    let svg = d3.select('.' + props.className).append('svg')
                .attr('height', "20px")
                .attr('width', "100%")
                .attr('id', 'svg-viz-' + props.className)

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

    let dataArray = props.className.split('-').map(item => shorthand[item]);
    
    svg.selectAll("circle")
        .data(dataArray)
        .enter().append("circle")
                    .attr("r", "10")
                    .attr("cx", (d, i) => 80*i + 10)
                    .attr("cy", "10")
                    .attr("fill", (d) => color[d])
    
    
    svg.selectAll("line")
        .data(dataArray.slice(0, dataArray.length -1))
        .enter().append("line")
                    .attr("x1", (d, i) => 80*i +25)
                    .attr("y1", "10")
                    .attr("y2", "10")
                    .attr("width", 10)
                    .attr("x2", (d, i) => 80*i + 75)
                    .attr("stroke", "#ded9d3")
                    .attr("stroke-width", "1")

    svg.append("text").selectAll("tspan")
        .data(dataArray)
        .enter().append("tspan")
        .attr("x", (d, i) => 80 * i + 10)
        .attr("y", 10)
        .attr("stroke", "white")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "10")
        .text((d) => d)

  }
export default Viz
