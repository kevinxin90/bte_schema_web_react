import React from 'react';
import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'

export default function TreeGraph ({graph}) {
    return (
        <div>
            <h3>Graph</h3>
            <Tree
                data={graph}
                height={700}
                width={800}/>
        </div>
    )
}
