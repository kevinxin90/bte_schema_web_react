import React, { PureComponent } from 'react';
import { Grid, Icon, Button, Popup } from 'semantic-ui-react';

import {colorSchema, semanticTypeShorthand} from '../shared/semanticTypes';
import { getPublicationLink } from '../shared/utils';

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

  addConnection(record, inputType, outputType, equivalentIds) {
    let [width, height] = this.getDimensions();
    let rec = record.split('||');

    //check if nodes exist and if not add them to list of nodes
    if (this.state.cy.$id(rec[1]).length === 0) {
      this.state.cy.add({
        group: 'nodes',
        data: {
          id: rec[1],
          type: inputType,
          equivalentIds: equivalentIds[rec[0]]
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

    if (this.state.cy.$id(rec[6]).length === 0) {
      let slot = this.state.slots.shift(); //get first open slot
      if (this.state.slots.length === 0) {
        this.state.slots.push(slot + 1); //add slot after current if no slots remain
      }

      this.state.cy.add({
        group: 'nodes',
        data: {
          id: rec[6],
          type: rec[7],
          equivalentIds: equivalentIds[rec[5]],
          slot: slot,
        },
        position: {
          x: width / 2,
          y: ((height / 2) + this.heightModifier(slot))
        },
        style: {
          'background-color': colorSchema[semanticTypeShorthand[rec[7]]] || 'black'
        }
      });
    }

    if (this.state.cy.$id(rec[12]).length === 0) {
      this.state.cy.add({
        group: 'nodes',
        data: {
          id: rec[12],
          equivalentIds: equivalentIds[rec[11]],
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
    let edge1 = this.state.cy.$id(`${rec[1]}-${rec[2]}-${rec[6]}`);
    if (edge1.length === 0) {
      this.state.cy.add({
        group: 'edges',
        data: {
          id: `${rec[1]}-${rec[2]}-${rec[6]}`,
          source: rec[1],
          target: rec[6],
          label: rec[2],
          publications: [{api: rec[3], publication: rec[4], count: 1}],
          connections: 1
        }
      })
    } else {
      edge1.data('connections', edge1.data('connections') + 1); // increment connections if edge already exists
      
      //increment count if api/publication combo exists, otherwise make a new one
      let idx = edge1.data('publications').findIndex((x) => (x.api === rec[3] && x.publication === rec[4]));
      if (idx === -1) {
        edge1.data('publications').push({api: rec[3], publication: rec[4], count: 1});
      } else {
        edge1.data('publications')[idx].count += 1;
      }
    }
    
    let edge2 = this.state.cy.$id(`${rec[6]}-${rec[8]}-${rec[12]}`);
    if (edge2.length === 0) {
      this.state.cy.add({
        group: 'edges',
        data: {
          id: `${rec[6]}-${rec[8]}-${rec[12]}`,
          source: rec[6],
          target: rec[12],
          label: rec[8],
          publications: [{api: rec[9], publication: rec[10], count: 1}],
          connections: 1
        },
      })
    } else {
      edge2.data('connections', edge2.data('connections') + 1); // increment connections if edge already exists
      
      //increment count if api/publication combo exists, otherwise make a new one
      let idx = edge2.data('publications').findIndex((x) => (x.api === rec[9] && x.publication === rec[10]));
      if (idx === -1) {
        edge2.data('publications').push({api: rec[9], publication: rec[10], count: 1});
      } else {
        edge2.data('publications')[idx].count += 1;
      }
    }
  }

  deleteConnection(record) {
    let rec = record.split('||');

    let edge1 = this.state.cy.$id(`${rec[1]}-${rec[2]}-${rec[6]}`);
    let edge2 = this.state.cy.$id(`${rec[6]}-${rec[8]}-${rec[12]}`);

    //decrement publications then remove if count is 0
    let idx1 = edge1.data('publications').findIndex((x) => (x.api === rec[3] && x.publication === rec[4]));
    let idx2 = edge2.data('publications').findIndex((x) => (x.api === rec[9] && x.publication === rec[10]));
    edge1.data('publications')[idx1].count -= 1;
    edge2.data('publications')[idx2].count -= 1;
    if (edge1.data('publications')[idx1].count <= 0) {
      edge1.data('publications').splice(idx1, 1);
    }
    if (edge2.data('publications')[idx2].count <= 0) {
      edge2.data('publications').splice(idx2, 1);
    }

    //decrement connections then remove edge if number of connections is 0
    edge1.data('connections', edge1.data('connections') - 1);
    edge2.data('connections', edge2.data('connections') - 1);
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
            ${
              Object.keys(node.data('equivalentIds'))
              .filter(key => !["primary", "display", "type", "name"].includes(key)) //ignore primary, display, type, and name fields
              .map((key) => `<p>${key}: ${node.data('equivalentIds')[key]}</p>`)
              .join("")
            }
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
            ${edge.data('publications').map(x => x.publication).join("")
              ? `<p><a href="${getPublicationLink(edge.data('publications').map(x => x.publication).join(",").split(","))}" target="_blank" rel="noopener noreferrer">Open All Publications <i class="external alternate icon"></i></a></p>`
              : ""}
            
            ${edge.data('publications').map((combo) => ( //convert publications into paragraphs with the format api:publications
              combo.publication //don't show a link if there are no publications
              ? `<p><strong>${combo.api}</strong>:<br> <a href="${getPublicationLink(combo.publication.split(","))}" target="_blank" rel="noopener noreferrer">Publications (${combo.publication.split(",").length}) <i class="external alternate icon"></i></a></p>` 
              : `<p><strong>${combo.api}</strong>: No publications`
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
                  content="Use the toggles on the table to add results to the graph. 
                    Click on a node for more info on that node. Click on an edge to see publications for that relationship. 
                    Click the 'Zoom Fit' button to fit the graph to the viewport."
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