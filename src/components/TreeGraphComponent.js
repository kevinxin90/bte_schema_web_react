import React, {Component} from 'react';
import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'

export default class TreeGraph extends Component {
    render() {
        const renderGraph = () => (
            <div>
                <h3>Graph</h3>
                <Tree
                    data={this.props.graph}
                    height={700}
                    width={1000}/>
                </div>
          )
        return (
            this.props.resultReady ? renderGraph(): null
        ) 
    }
}

