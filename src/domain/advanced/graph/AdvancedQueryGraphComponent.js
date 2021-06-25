import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Dropdown, Grid, Icon, Button, Popup } from 'semantic-ui-react';
import BiomedicalIDDropdown from './BiomedicalIDDropdown';

import { colorSchema, semanticTypeShorthand } from '../../../shared/semanticTypes';
import GraphModeSwitcher, { MODE } from './GraphModeSwitcher';

import cytoscape from '../../../shared/cytoscapeInit';
import Tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

import _ from 'lodash';

import getMetaKG, { getCategories, getPredicates } from '../../../shared/metaKG';

export default class AdvancedQueryGraph extends Component {
  constructor(props) {
    super(props);
    
    //load metakg graph
    getMetaKG();

    this.state = {
      eh: {}, //cytoscape edgehandles object
      selectedElementID: "", //element displayed on table
      tip: {}, //store current tippy object
      mode: 1
    };

    this.setMode = this.setMode.bind(this);
    this.zoomFit = this.zoomFit.bind(this);
    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handlePredicateChange = this.handlePredicateChange.bind(this);
  }

  setSelectedElementID(elementID) {
    this.props.cy.getElementById(this.state.selectedElementID).removeClass('highlight'); //remove overlay from old selected element
    this.props.cy.getElementById(elementID).addClass('highlight'); //add overlay to new selected element
    this.setState({selectedElementID: elementID});
  }

  //set mode (for mode switcher component)
  setMode(mode) {
    if (mode === MODE.addEdge) {
      this.state.eh.enable();
      this.state.eh.enableDrawMode();
    } else {
      this.state.eh.disableDrawMode();
      this.state.eh.disable();
    }
    this.setState({mode: mode});
  }

  //get dimensions of enclosing div (for node positioning purposes)
  getDimensions() { 
    let domRect = document.getElementById('cy').getBoundingClientRect();

    return [domRect.width, domRect.height];
  }

  zoomFit() {
    let [width, height] = this.getDimensions();
    this.props.cy.fit();
    this.props.cy.zoom({level: this.props.cy.zoom() * 0.99, position: {x: width/2, y: height/2}});
  }

  //create node based on mouse position
  createNode(e) {
    this.props.cy.add([{
      group: "nodes",
      data: {
        label: "Any",
        color: "black",
        ids: [],
        options: [],
        categories: [],
      },
      renderedPosition: {
        x: e.renderedPosition.x,
        y: e.renderedPosition.y,
      },
    }]);
  }

  removeElement(e) {
    this.props.cy.remove(e);
  }

  //creates popup on element with tippyContent as the content
  createTippy(element, tippyContent) {
    let dummy = document.createElement('div');
    let ref = element.popperRef();

    let tip = Tippy(dummy, {
      theme: 'light-border',
      trigger: 'manual',
      interactive: true,
      appendTo: document.body,
      getReferenceClientRect: ref.getBoundingClientRect,
      arrow: true,
      content() {
        let content = document.createElement('div');

        ReactDOM.render(tippyContent, content);
        return content;
      },
      onShow(instance) {
        instance.popper.querySelector('.close').addEventListener('click', () => {
          instance.hide();
        })
      },
      onUntrigger(instance) {
        this.setState({tip: {}});
        instance.destroy();
      }
    });

    tip.show();

    return tip;
  }

  //calculate and set node label
  setNodeLabel(node, ids, categories) {
    if (categories.length === 0 && ids.length === 0) {
      node.data('label', 'Any');
      node.data('color', 'black');
    } else if (categories.length === 1) {
      node.data('label', categories[0]);
      node.data('color', colorSchema[semanticTypeShorthand[categories[0]]])
    } else if (ids.length > 0) {
      node.data('label', ids.join(', '));
      node.data('color', 'black');
    } else {
      node.data('label', 'Multi');
      node.data('color', 'black');
    }
  }

  //node popup handling
  handleIDChange(data, node) {
    //calculate which items from all items are selected
    let selectedOptions = data.options.filter((option) => (data.value.includes(option.value)));
    let selectedCategories = [...selectedOptions.map(option => option.title), ...node.data('categories')]; //list of unique cateogries of selected objects + previous selected categories
    selectedCategories = [...new Set(selectedCategories)];

    //update data in cytoscape graph
    node.data('ids', data.value);
    node.data('options', selectedOptions);
    node.data('categories', selectedCategories);

    this.setNodeLabel(node, data.value, selectedCategories);

    //rerender popup
    let popupContent = this.getNodePopupContent(node);
    let content = document.createElement('div');
    ReactDOM.render(popupContent, content);
    this.state.tip.setContent(content);
  }

  handleAddItem(newOptions, node) {
    node.data('options', newOptions);

    //rerender popup
    let popupContent = this.getNodePopupContent(node);
    let content = document.createElement('div');
    ReactDOM.render(popupContent, content);
    this.state.tip.setContent(content);
  }

  //node popup handling
  handleCategoryChange (e, data, node) {
    node.data('categories', data.value);
    this.setNodeLabel(node, node.data('ids'), data.value);

    let popupContent = this.getNodePopupContent(node);
    let content = document.createElement('div');
    ReactDOM.render(popupContent, content);
    this.state.tip.setContent(content);
  };

  getNodePopupContent(node) {
    let popupContent = <div style={{paddingTop: "4px", paddingBottom: "4px"}}>
      <h3>Node</h3>
      IDs:
      <BiomedicalIDDropdown handleIDChange={this.handleIDChange} node={node} handleAddItem={this.handleAddItem} />
      Categories:
      <Dropdown 
        placeholder='Categories'
        name='nodeCategories'
        label='categories'
        multiple
        search
        selection
        onChange={(e, data) => (this.handleCategoryChange(e, data, node))}
        options={_.map(getCategories(), (category) => ({text: category, value: category}))}
        value={node.data('categories')}
      />
      <Button onClick={() => { this.props.nodeQuery(node) }} style={{marginTop: "0.75em"}}>
        View Results for Node
      </Button>
      <Button onClick={() => { this.removeElement(node) }} className="close">
        Delete Node
      </Button>
    </div>;
    return popupContent;
  }

  showNodeOptions(node) {
    let popupContent = this.getNodePopupContent(node);
  
    let tip = this.createTippy(node, popupContent);

    this.setState({tip: tip});
  }

  //calculate and set edge label
  setEdgeLabel(edge, predicates) {
    edge.data('label', predicates.join(', '));
  }

  //edge popup handling
  handlePredicateChange = (e, data, edge) => {
    edge.data('predicates', data.value);
    this.setEdgeLabel(edge, data.value);

    let popupContent = this.getEdgePopupContent(edge);
    let content = document.createElement('div');
    ReactDOM.render(popupContent, content);
    this.state.tip.setContent(content);
  };

  getEdgePopupContent(edge) {
    let connectedNodes = edge.connectedNodes();
    let edgePredicates = edge.data('predicates') || [];
    let popupContent = <div>
      <h3>Edge</h3>
      Predicates:
      <Dropdown 
        placeholder='Predicates'
        multiple
        search
        selection
        onChange={(e, data) => (this.handlePredicateChange(e, data, edge))}
        //make sure old chosen predicates are in the options for the new predicates
        options={_.map(getPredicates(connectedNodes[0].data('categories'), connectedNodes[1].data('categories'), edgePredicates), 
          (predicate, idx) => ({key: idx, text: predicate, value: predicate}))}
        value={edgePredicates}
      />
      <Button onClick={() => { this.props.edgeQuery(edge) }} style={{marginTop: "0.75em"}}>
        View Results for Edge
      </Button>
      <Button onClick={() => { this.removeElement(edge) }} className="close">
        Delete Edge
      </Button>
    </div>;
    return popupContent;
  }

  showEdgeOptions(edge) {
    let popupContent = this.getEdgePopupContent(edge);

    let tip = this.createTippy(edge, popupContent);

    this.setState({tip: tip});
  }

  componentDidMount() {
    const container = document.getElementById('cy');

    //cytoscape config and init
    const cy = cytoscape({
      container: container,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'background-color': 'data(color)',
            'overlay-opacity': 0,
            'overlay-color': '#000',
            'overlay-padding': 7,
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'label': 'data(label)',
            'text-rotation': 'autorotate',
            'text-margin-y': '-8',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'opacity': 0.5,
            'overlay-opacity': 0,
            'overlay-color': '#000',
            'overlay-padding': 7,
          }
        },
        {
          selector: ':active',
          style: {
            'overlay-opacity': 0.4,
            'overlay-color': '#000',
            'overlay-padding': 7,
          }
        }, {
          selector: '.highlight',
          style: {
            'overlay-opacity': 0.4, 
            'overlay-color': '#51cbee', 
            'overlay-padding': 7 
          }
        },
      ],
      minZoom: 0.1,
      maxZoom: 15,
      wheelSensitivity: 0.4,
    });

    //handle left click
    cy.on('tap', (event) => {
      if (this.state.mode === MODE.addNode) {
        this.createNode(event);
      } else if (this.state.mode === MODE.edit) {
        if (event.target !== cy && event.target.isNode()) {
          this.showNodeOptions(event.target);
        } else if (event.target !== cy && event.target.isEdge()) {
          this.showEdgeOptions(event.target);
        }
      }
    });

    //delete elements on right click
    cy.on('cxttap', (event) => {
      if (event.target !== cy) {
        this.removeElement(event.target);
      }
    });

    let eh = cy.edgehandles({hoverDelay: 0});

    this.props.setCy(cy);
    this.setState({eh: eh}); 
  } 

  render() {
    return (
      <div style={{ paddingTop: "1rem", paddingBottom: "0.5rem" }}>
        <Grid stackable columns={3}>
          <Grid.Row>
            <Grid.Column>
              <h2>
                Query Graph &nbsp;&nbsp;
                <Popup 
                  trigger={ <Icon circular name="info" size="tiny" style={{verticalAlign: 4}}/> }
                >
                  <Popup.Content>
                    <div>
                      <p>Use Edit mode to add attributes to nodes/edges and reposition nodes.</p>
                      <p>Left click while in Add Node mode to place nodes.</p>
                      <p>Click and drag while in Add Edge mode to create new edges.</p>
                      <p>Right click to remove nodes/edges.</p>
                    </div>
                  </Popup.Content>
                </Popup> 
                </h2>
            </Grid.Column>
            <Grid.Column style={{textAlign: "center"}}>
              <GraphModeSwitcher mode={this.state.mode} setMode={this.setMode} />
            </Grid.Column>
            <Grid.Column style={{textAlign: "right"}}>
              <Button basic compact style={{marginRight: 0, marginBottom: 5}} onClick={this.zoomFit}><Icon name="search" />Zoom Fit</Button>
              </Grid.Column>
          </Grid.Row>
        </Grid>
        <div id="cy" style={{ height: "50vh", border: "1px solid #ddd" }}></div>
      </div>
    )
  }
}