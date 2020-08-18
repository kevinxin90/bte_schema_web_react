import React, { Component } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { colorSchema, semanticTypeShorthand } from '../../shared/semanticTypes';

class Graph extends Component {

    render() {

        let styles = [
            {
                selector: '#source',
                style: {
                    'background-color': colorSchema[semanticTypeShorthand[this.props.source.type]]
                }
            },
            {
                selector: '#target',
                style: {
                    'background-color': colorSchema[semanticTypeShorthand[this.props.output]]
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
                    'target-arrow-shape': 'triangle'
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

        const positions = {
            0: [],
            1: [200],
            2: [125, 275],
            3: [100, 300, 200],
            4: [75,150,225,300],
            5: [50,125,275,350, 200]
        }

        const elements = [
            { data: {id:'source', label:this.props.source.name}, position: {x:200, y:50}, classes:'static'},
            { data: {id:'target', label:this.props.output}, position: {x:200, y:450}, classes:'static'}
        ]

        var xPos = positions[this.props.branches.length];
        for (const [index, branch] of this.props.branches.entries()) {
            const name = 'edge' + index;
            if (branch.intermediates.length === 0){
                elements.push(
                    { data : {source: 'source', target: 'target'}, classes:name}
                );
            }
            else {
                var yPos = positions[branch.intermediates.length];
                var prevNode = 'source';
                for (const value of branch.intermediates.entries()) {
                    var id = '' + branch.id + value[0];
                    elements.push({data: {id:id, label:value[1]}, position: {x:xPos[index], y:yPos[value[0]]}}); //node
                    styles.push({ selector: '#' + id, style: { 'background-color': colorSchema[semanticTypeShorthand[value[1]]] } })
                    elements.push({data: {source:prevNode, target:id}, classes:name});
                    prevNode = id;
                }
                elements.push({data: {source:prevNode, target:'target'}, classes:name});
            }
        }

        return (
            <div className="graph">
                <CytoscapeComponent 
                    elements={elements} 
                    stylesheet={styles}
                    className="cyStyle"
                    minZoom={0.5}
                    maxZoom={2.5}
                />
            </div>
        );
    }
}

export default Graph;