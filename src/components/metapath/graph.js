import React, { Component } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { colorSchema, semanticTypeShorthand } from '../../shared/semanticTypes';

class Graph extends Component {

    render() {

        var w = 400;
        var h = 500;
        // issue with the modal (smaller screens) not working w/ this code to get height/width
        try {
            if (document.getElementById("cytoGraph").clientWidth !== 0) {
                w = document.getElementById("cytoGraph").clientWidth;
                h = document.getElementById("cytoGraph").clientHeight;
            }
        } catch (err) { /* default to 400,500 */ }

        let styles = [
            {
                selector: '#source',
                style: {
                    'background-color': colorSchema[semanticTypeShorthand[this.props.source.type]]
                }
            },
            {
                selector: 'node',
                style: {
                    content: 'data(label)',
                    'text-valign': 'center',
                    'font-size': 10,
                    width: 30,
                    height: 30
                }
            },
            {
                selector: '.static',
                style: {
                    width: 50,
                    height: 50,
                    'font-size': 15
                }
            },
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'edge-distances': 'node-position'
                }
            },
            {
                selector: '.edge0',
                style: {
                    'line-color': '#8A5BC4',
                    'target-arrow-color': '#8A5BC4'
                }
            },
            {
                selector: '.edge1',
                style: {
                    'line-color': '#B184E9',
                    'target-arrow-color': '#B184E9'
                }
            },
            {
                selector: '.edge2',
                style: {
                    'line-color': '#CBB4E7',
                    'target-arrow-color': '#CBB4E7'
                }
            }
        ]

        const elements = [
            { data: {id:'source', label:this.props.source.name}, position: {x:w/2, y:50}, classes:'static'},
           // { data: {id:'target', label:this.props.output}, position: {x:w/2, y:h-50}, classes:'static'}
        ]

        var numBranches = this.props.branches.length;
        for (const [index, branch] of this.props.branches.entries()) {
            const name = 'edge' + index;
            /*if (branch.path.length === 0){
                elements.push(
                    { data : {source: 'source', target: 'target'}, classes:name}
                );
            }*/
            if (branch.path.length !== 0) {
                var numNodes = branch.path.length;
                var prevNode = 'source';
                for (const value of branch.path.entries()) {
                    var id = '' + branch.id + value[0];
                    elements.push({data: {id:id, label:value[1]}, position: {x:(w/(numBranches+1) * (index + 1)), y:(h/numNodes)*(value[0]+1)-50}}); //node
                    styles.push({ selector: '#' + id, style: { 'background-color': colorSchema[semanticTypeShorthand[value[1]]] } })
                    elements.push({data: {source:prevNode, target:id}, classes:name});
                    prevNode = id;
                }
                //elements.push({data: {source:prevNode, target:'target'}, classes:name});
            }
        }

        return (
            <div className="graph" >
                <CytoscapeComponent 
                    elements={elements} 
                    stylesheet={styles}
                    className="cyStyle"
                    minZoom={0.5}
                    maxZoom={2.5}
                    id="cytoGraph"
                />
            </div>
        );
    }
}

export default Graph;