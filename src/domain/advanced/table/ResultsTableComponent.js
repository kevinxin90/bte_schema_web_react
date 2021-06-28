//wrapper for table display, handles figuring out which entries to display
import React from 'react';
import ResultsTableDisplay from './ResultsTableDisplayComponent';
import _ from 'lodash';

const ResultsTable = ({response, mode, selectedElementID, cy, ...props}) => {
  //flatten attributes to same level as other properties of an object
  const flattenElement = (element) => {
    let flattened = {};
    Object.keys(element).forEach((key) => {
      if (key === 'attributes') {
        element.attributes.forEach(attr => {
          flattened[attr.attribute_type_id] = attr.value;
        })
      } else {
        flattened[key] = element[key];
      }
    })

    return flattened;
  }
  
  const calculateTableGivenNode = (response, selectedNodeID) => {
    let entries = [];
    let ids = new Set();

    //get all ids associated with node
    response.message.results.forEach((result) => {
      if (result.node_bindings.hasOwnProperty(selectedNodeID)) {
        let nodeID = result.node_bindings[selectedNodeID][0].id;
        ids.add(nodeID);
      }
    });

    //get the data from the knowledge graph for those ids
    entries = _.map(Array.from(ids), (id) => {
      let entry = {node: flattenElement(response.message.knowledge_graph.nodes[id])};
      entry.node.entity_id = id;
      entry.node.qg_id = selectedNodeID;
      return entry;
    });
    return entries;
  }

  const calculateTableGivenEdge = (response, selectedEdgeID) => {
    let entries = [];

    //get all results that are related to the edge then flatten them to the desired shape
    response.message.results.forEach((result) => {
      if (result.edge_bindings.hasOwnProperty(selectedEdgeID)) {
        let cy_edge = cy.getElementById(selectedEdgeID);

        let edge = flattenElement(response.message.knowledge_graph.edges[result.edge_bindings[selectedEdgeID][0].id]); //get knowledge graph edge
        
        let source = flattenElement(response.message.knowledge_graph.nodes[edge.subject]);
        source.entity_id = edge.subject;
        source.qg_id = cy_edge.source().id(); 

        let target = flattenElement(response.message.knowledge_graph.nodes[edge.object]);
        target.entity_id = edge.object;
        target.qg_id = cy_edge.target().id(); 

        entries.push({source: source, edge: edge, target: target});
      }
    });

    return entries;
  }

  if (!response || _.isEmpty(response)) {//handle no query
    return <div>
      <h3>Query Results</h3>
      <div>Click 'Query BTE' to get query results.</div>
    </div>;

  } else if (response.message.results.length === 0) {//handle query gives no results
    return <div>
      <h3>Query Results</h3>
      <div>No results.</div>
    </div>;

  } else {//handle query gives results
    let entries = [];
    if (mode === 'edge') {
      entries = calculateTableGivenEdge(response, selectedElementID);
    } else if (mode === 'node') {
      entries = calculateTableGivenNode(response, selectedElementID);
    } 

    return <div>
      <h3>Query Results</h3>
      <ResultsTableDisplay 
        results={entries}
        cy={cy}
        mode={mode}
        {...props}
      />
    </div>;
  }
};

export default ResultsTable;