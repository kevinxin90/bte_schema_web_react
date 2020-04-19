import React from 'react';
import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'

export default function TreeGraph (props) {
    return (
        <div>
            <h3>Graph</h3>
            <Tree
                data={props.graph}
                height={700}
                width={1000}/>
        </div>
    )
}
