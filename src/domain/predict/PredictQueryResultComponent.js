import ReactLoader from '../../components/DimerComponent';
import React, { Component } from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import BTETable from '../../components/DisplayTableResult';
import CytoscapeComponent from 'react-cytoscapejs';
import { colorSchema, semanticTypeShorthand } from '../../shared/semanticTypes';

export default class PredictQueryResult extends Component {
    render() {

        let w;
        try {
            w = document.getElementById("resultG").clientWidth;
        } catch (err) {
            w = 1000;
        }
        
        let styles = [
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    content: 'data(label)',
                    'text-margin-y': '-10px'
                }
            },
            {
                selector: 'node',
                style: {
                    content: 'data(label)',
                    'text-valign': 'center',
                    'font-size': 15,
                    width: 50,
                    height: 50
                }
            },
            {
                selector: '#0',
                style: {
                    'background-color': colorSchema[semanticTypeShorthand[this.props.source.type]]
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
    
        let panes = this.props.branches.map((item, i) => {

            let elements = [ {data: { id: 0, label: item.source.type}, position: {x:100, y:40}} ]
            const name = 'edge' + i;
            for (let j = 0; j < item.path.length; j++) {
                elements.push({ data: { id: j+1, label: item.path[j]}, position: {x: ((w-200)/item.path.length)*(j+1)+100, y:40}});
                elements.push({ data: { source: j, target: j+1, label: 'Step ' + (j+1) }, classes:name});
                styles.push({ selector: '#' + (j+1), style: { 'background-color': colorSchema[semanticTypeShorthand[item.path[j]]] } });
            }

            return {
                menuItem: 'Path ' + (i + 1),
                render: () =>
                    <Tab.Pane>

                        <CytoscapeComponent 
                            id="resultG"
                            elements={elements} 
                            className="resultGraph"
                            stylesheet={styles}
                            minZoom={0.5}
                            maxZoom={2.5}
                        />
                        
                        <BTETable
                            handleSelect={this.props.handleSelect}
                            // table={this.props.table}
                            handleSort={this.props.handleSort}
                            filter={this.props.filter}
                            filterOptions={this.props.filterOptions}
                            handleFilterSelect={this.props.handleFilterSelect}
                            handlePaginationChange={this.props.handlePaginationChange}
                            selectedQueryResults={this.props.selectedQueryResults}
                            
                            totalPages={this.props.table.totalPages[i]}
                            display={this.props.table.display[i]}
                            queryResults={this.props.queryResults[i]}
                            branch={item}
                        />
                    </Tab.Pane>
            }
        })

        return (
            <div className={this.props.shouldDisplay ? '' : 'hidden'}>
                <Segment color='blue'>
                    <Tab panes={panes} />
                </Segment>
            </div>
        )
    }
}

