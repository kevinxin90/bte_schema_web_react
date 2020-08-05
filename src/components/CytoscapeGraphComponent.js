import React, { PureComponent } from 'react';
import { Grid, Icon, Button, Popup } from 'semantic-ui-react';

import {colorSchema, semanticTypeShorthand} from '../shared/semanticTypes';
import { getPublicationLink } from '../shared/utils';

import { zip } from 'lodash';
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import Tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
cytoscape.use(popper);


export default class CytoscapeGraph extends PureComponent {
  constructor(props){
    super(props);

    this.state = { 
      cy: {}, 
      elements: {nodes: [], edges: []},
      slots: [0], //array that keeps track of empty slots for middle nodes
    };

    this.zoomFit = this.zoomFit.bind(this);
  }

  //modify y-position of node based on slot number (starting from the middle and alternating above and below)
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

  //get dimensions of enclosing div (for node positioning purposes)
  getDimensions() { 
    let domRect = document.getElementById('cy').getBoundingClientRect();

    return [domRect.width, domRect.height];
  }

  addConnection(record, inputType, outputType) {
    let [width, height] = this.getDimensions();
    let rec = record.split('||');

    //check if nodes exist and if not add them to list of nodes
    if (this.state.cy.$id(rec[0]).length === 0) {
      this.state.cy.add({
        group: 'nodes',
        data: {
          id: rec[0],
          type: inputType
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
          type: rec[5],
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

    if (this.state.cy.$id(rec[9]).length === 0) {
      this.state.cy.add({
        group: 'nodes',
        data: {
          id: rec[9],
          type: outputType,
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
          publications: [rec[3].split(',').join(', ')],
          apis: [rec[2]],
          connections: 1
        }
      })
    } else {
      edge1.data('connections', edge1.data('connections') + 1); // increment connections if edge already exists
      edge1.data('apis').push(rec[2]);
      edge1.data('publications').push(rec[3].split(',').join(', '));
    }
    
    let edge2 = this.state.cy.$id(`${rec[4]}-${rec[6]}-${rec[9]}`);
    if (edge2.length === 0) {
      this.state.cy.add({
        group: 'edges',
        data: {
          id: `${rec[4]}-${rec[6]}-${rec[9]}`,
          source: rec[4],
          target: rec[9],
          label: rec[6],
          publications: [rec[8].split(',').join(', ')],
          apis: [rec[7]],
          connections: 1
        },
      })
    } else {
      edge2.data('connections', edge2.data('connections') + 1); // increment connections if edge already exists
      edge2.data('apis').push(rec[7]);
      edge2.data('publications').push(rec[8].split(',').join(', '));
    }
  }

  deleteConnection(record) {
    let rec = record.split('||');

    //decrement connections and remove apis/publications then remove edge if connections is 0
    let edge1 = this.state.cy.$id(`${rec[0]}-${rec[1]}-${rec[4]}`);
    let edge2 = this.state.cy.$id(`${rec[4]}-${rec[6]}-${rec[9]}`);
    edge1.data('connections', edge1.data('connections') - 1);
    edge2.data('connections', edge2.data('connections') - 1);
    let idx1 = edge1.data('publications').indexOf(rec[3].split(',').join(', '));
    let idx2 = edge2.data('publications').indexOf(rec[8].split(',').join(', '));
    edge1.data('apis').splice(idx1, 1);
    edge1.data('publications').splice(idx1, 1);
    edge2.data('apis').splice(idx2, 1);
    edge2.data('publications').splice(idx2, 1);

    if (edge1.data('connections') <= 0) {
      this.state.cy.remove(edge1);
    }
    if (edge2.data('connections') <= 0) {
      this.state.cy.remove(edge2);
    }

    // delete nodes if they have no edge connections
    let node_idxs = [0, 4, 9];
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

  //initial cytoscape setup
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
            'width': 2,
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
      maxZoom: 15,
      wheelSensitivity: 0.4,
      layout: {
        name: 'preset'
      }
    });
    
    //show tooltips when clicked
    cy.on('click', 'node', function(event) {
      let node = event.target;

      let dummy = document.createElement('div');

      let tip = new Tippy(dummy, {
        trigger: 'manual',
        lazy: false,
        interactive: true,
        appendTo: document.body,
        onCreate(instance) { 
          instance.popperInstance.reference = node.popperRef(); 
        },
        content() {
          let content = document.createElement('div');
          content.innerHTML = `
            <h3>${node.id()}</h3>
            <p>Type: ${node.data('type')}</p>
          `;
          return content;
        },
        onUntrigger(instance) {
          instance.destroy();
        }

      });

      tip.show();
    });

    cy.on('click', 'edge', function(event) {
      let edge = event.target;

      let dummy = document.createElement('div');

      let tip = new Tippy(dummy, {
        trigger: 'manual',
        lazy: false,
        interactive: true,
        appendTo: document.body,
        onCreate(instance) { 
          instance.popperInstance.reference = edge.popperRef();
        },
        content() {
          let content = document.createElement('div');
          content.innerHTML = `
            <h3>Publications</h3>
            ${zip(edge.data('apis'), edge.data('publications')).map((combo) => ( //convert apis and publications arrays into paragraphs with the format api:publications
              `<p><strong>${combo[0]}</strong>:<br> <a href=${getPublicationLink(combo[1].split(", "))} target="_blank" rel="noopener noreferrer">Publications (${combo[1].split(", ").length}) <i class="external alternate icon"></i></a></p>`
            )).join("")}
          `;
          return content;
        },
        onUntrigger(instance) {
          instance.destroy();
        }
      });
      
      tip.show();
    });

    this.setState({cy: cy}); 
  }

  zoomFit() {
    let [width, height] = this.getDimensions();
    this.state.cy.fit();
    this.state.cy.zoom({level: this.state.cy.zoom() * 0.99, position: {x: width/2, y: height/2}});
  }

  render() {
    return (
      <div>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <h2>
                Graph &nbsp;&nbsp;
                <Popup 
                  content="Use the toggles to add results to the graph. Click on nodes and edges for more info"
                  trigger={ <Icon circular name="info" size="tiny" style={{verticalAlign: 4}}/> }
                /> 
                </h2>
            </Grid.Column>
            <Grid.Column style={{textAlign: "right"}}>
              <Button basic compact style={{marginRight: 0, marginBottom: 5}} onClick={this.zoomFit}><Icon name="search" />Zoom Fit</Button>
              </Grid.Column>
          </Grid.Row>
        </Grid>
        <div id="cy" style={{ height: 600, border: "1px solid #ddd" }}></div>
      </div>
    )
  }
}