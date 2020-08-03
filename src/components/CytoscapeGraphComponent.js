import cytoscape from 'cytoscape';
import React, { PureComponent } from 'react';
import {colorSchema, semanticTypeShorthand} from '../shared/semanticTypes';

export default class CytoscapeGraph extends PureComponent {
  constructor(props){
    super(props);

    this.state = { 
      cy: {}, 
      elements: {nodes: [], edges: []},
      slots: [0], //array that keeps track of empty slots for middle nodes
    };
  }

  heightModifier(slot) {
    const pixelsPerSlot = 70;

    if (slot === 0) {
      return 0;
    } else if (slot % 2 === 0) { //even = below
      return -1 * (Math.ceil(slot / 2)) * pixelsPerSlot;
    } else { //odd = above
      return (Math.ceil(slot / 2)) * pixelsPerSlot;
    }
  }

  getDimensions() {
    let domRect = document.getElementById('cy').getBoundingClientRect();

    return [domRect.width, domRect.height];
  }

  //result 
  addConnection(record, inputType, outputType) {
    let [width, height] = this.getDimensions();
    let rec = record.split('||');

    //check if nodes exist and if not add them to list of nodes
    if (this.state.cy.$id(rec[0]).length === 0) {
      this.state.cy.add({
        group: 'nodes',
        data: {
          id: rec[0],
        },
        position: {
          x: 100,
          y: height / 2
        },
        style: {
          'background-color': colorSchema[semanticTypeShorthand[inputType]] || 'black'
        }
      });
    }

    if (this.state.cy.$id(rec[4]).length === 0) {
      let slot = this.state.slots.shift(); //get first open slot
      if (this.state.slots.length === 0) {
        this.state.slots.push(slot + 1); //add slot after current if no slots remain
      }

      this.state.cy.add({
        group: 'nodes',
        data: {
          id: rec[4],
          slot: slot,
        },
        position: {
          x: width / 2,
          y: ((height / 2) + this.heightModifier(slot))
        },
        style: {
          'background-color': colorSchema[semanticTypeShorthand[rec[5]]] || 'black'
        }
      });
    }

    if (this.state.cy.$id(rec[8]).length === 0) {
      this.state.cy.add({
        group: 'nodes',
        data: {
          id: rec[8],
          degree: 0
        },
        position: {
          x: width - 100,
          y: height / 2
        },
        style: {
          'background-color': colorSchema[semanticTypeShorthand[outputType]] || 'black'
        }
      });
    }

    //add edges
    let edge1 = this.state.cy.$id(`${rec[0]}-${rec[1]}-${rec[4]}`);
    if (edge1.length === 0) {
      this.state.cy.add({
        group: 'edges',
        data: {
          id: `${rec[0]}-${rec[1]}-${rec[4]}`,
          source: rec[0],
          target: rec[4],
          label: rec[1],
          connections: 1
        }
      })
    } else {
      edge1.data('connections', edge1.data('connections') + 1); // increment connections if edge already exists
    }
    
    let edge2 = this.state.cy.$id(`${rec[4]}-${rec[6]}-${rec[8]}`);
    if (edge2.length === 0) {
      this.state.cy.add({
        group: 'edges',
        data: {
          id: `${rec[4]}-${rec[6]}-${rec[8]}`,
          source: rec[4],
          target: rec[8],
          label: rec[6],
          connections: 1
        },
      })
    } else {
      edge2.data('connections', edge2.data('connections') + 1); // increment connections if edge already exists
    }
  }

  deleteConnection(record) {
    let rec = record.split('||');

    //decrement connections then remove edge if connections is 0
    let edge1 = this.state.cy.$id(`${rec[0]}-${rec[1]}-${rec[4]}`);
    let edge2 = this.state.cy.$id(`${rec[4]}-${rec[6]}-${rec[8]}`);
    edge1.data('connections', edge1.data('connections') - 1);
    edge2.data('connections', edge2.data('connections') - 1);
    if (edge1.data('connections') <= 0) {
      this.state.cy.remove(edge1);
    }
    if (edge2.data('connections') <= 0) {
      this.state.cy.remove(edge2);
    }

    // delete nodes if they have no edge connections
    let node_idxs = [0, 4, 8];
    node_idxs.forEach((node_idx) => {
      let node = this.state.cy.$id(rec[node_idx]);
      if (node.degree() === 0) {
        if (node.data('slot') !== undefined) { //compare to undefined because slot can be 0
          this.state.slots.unshift(node.data('slot')); //return deleted slot to available slots
        }

        this.state.cy.remove(node);
      }
    });
  }

  componentDidMount() {
    const container = document.getElementById('cy');
    const cy = cytoscape({
      container: container,
      elements: this.state.elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(id)',
            'background-color': 'black'
          }
        },

        {
          selector: 'edge',
          style: {
            'label': 'data(label)',
            'text-rotation': 'autorotate',
            'text-margin-y': '-6',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'opacity': 0.5
          }
        }
      ],
      minZoom: 0.1,
      maxZoom: 25,
      layout: {
        name: 'preset'
      }
    });
    
    this.setState({cy: cy});
  }

  render() {
    return <div id="cy" style={{height: 400}}></div>
  }
}