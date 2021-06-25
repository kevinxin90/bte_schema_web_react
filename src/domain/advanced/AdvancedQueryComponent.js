import React, { Component, useState } from 'react';
import { Button, Header, Container, Modal, Message, Menu, Segment } from 'semantic-ui-react';
import { Navigation } from '../../components/Breadcrumb';
import ResultsTable from './table/ResultsTableComponent';
import AdvancedQueryGraph from './graph/AdvancedQueryGraphComponent';
import axios from 'axios';
import _ from 'lodash';

const TRAPIQueryButton = ({TRAPIQuery}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return <Modal
    closeIcon
    open={modalOpen}
    trigger={<Button>View TRAPI Query</Button>}
    onClose={() => setModalOpen(false)}
    onOpen={() => setModalOpen(true)}
  >
    <Header>Current TRAPI Query</Header>
    <Modal.Content>
      <p style={{"whiteSpace": "pre-wrap"}}>
        {JSON.stringify(TRAPIQuery(), null, 2)}
      </p>
    </Modal.Content>
  </Modal>
}

const ARSDisplay = ({arsPK}) => {
  const [messageVisible, setMessageVisible] = useState(true);

  if (arsPK) {
    return (
      <div>
        <h3>ARS Results</h3>
        {
          messageVisible && 
          <Message warning floating
            content="ARS results may take a minute to show up, try waiting 
            a minute and refreshing the page if results don't show up immediately."
          />
        } 
        <Button 
          as='a' href={`https://arax.ncats.io/?source=ARS&id=${arsPK}`} 
          icon='external' labelPosition='left' content="Open ARS" target="_blank" 
        />
      </div>
    );
  } else {
    return (
      <div>
        <h3>ARS Results</h3>
        <div>Click 'Query ARS' to get ARS results.</div>
      </div>
    );
  }
}

class AdvancedQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {},
      selectedElementID: "",
      mode: "",
      loading: false,
      loadingARS: false,
      cy: {},
      arsPK: "",
      messageVisible: true,
      activeItem: "BTE"
    };

    this.setCy = this.setCy.bind(this);
    this.cyJSON = this.cyJSON.bind(this);
    this.TRAPIQuery = this.TRAPIQuery.bind(this);

    this.graphRef = React.createRef();

    this.edgeQuery = this.edgeQuery.bind(this);
    this.nodeQuery = this.nodeQuery.bind(this);
    this.defaultQuery = this.defaultQuery.bind(this);
    this.makeARSQuery = this.makeARSQuery.bind(this);
    this.setElementID = this.setElementID.bind(this);
    this.closeMessage = this.closeMessage.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  } 

  handleMenuClick(e, { name }) {
    this.setState({activeItem: name});
  }

  closeMessage() {
    this.setState({messageVisible: false});
  }

  //cy graph in json format
  cyJSON() {
    return this.state.cy.json && this.state.cy.json();
  }

  //get trapi query for cy graph
  TRAPIQuery() {
    let jsonGraph = this.cyJSON();
    let nodes = {};
    if (jsonGraph && jsonGraph.elements.nodes) {
      jsonGraph.elements.nodes.forEach((node) => {
        nodes[node.data.id] = {};

        //don't include ids or categories field if they are empty arrays
        if (Array.isArray(node.data.ids) && node.data.ids.length > 0) {
          nodes[node.data.id].ids = node.data.ids;
        };
        if (Array.isArray(node.data.categories) && node.data.categories.length > 0) {
          nodes[node.data.id].categories = _.map(node.data.categories, category => `biolink:${category}`);
        }
      });
    }

    let edges = {};
    if (jsonGraph && jsonGraph.elements.edges) {
      jsonGraph.elements.edges.forEach((edge) => {
        let pred = _.map(edge.data.predicates, predicate => `biolink:${predicate}`);
        edges[edge.data.id] = {
          "subject": edge.data.source,
          "object": edge.data.target
        };

        //only include predicates field if it is defined
        if (pred.length) {
          edges[edge.data.id].prediates = pred;
        }
      });
    }

    return {
      "message": {
        "query_graph": {
          "nodes": nodes,
          "edges": edges
        }
      }
    }
  }

  //a valid query must have at least 1 node with an id and 1 edge
  isValidQuery(jsonGraph) {
    if (!(jsonGraph.elements.edges && jsonGraph.elements.edges.length >= 1)) {
      alert("Graph must have at least 1 edge.");
      return false;
    } 
    for (let node of jsonGraph.elements.nodes) {
      if (node.data.ids.length > 0) {
        return true;
      }
    }
    alert("Graph must have at least 1 node with an id.");
    return false;
  }

  setElementID(id) {
    this.setState({
      selectedElementID: id
    })
    this.graphRef.current.setSelectedElementID(id);
  }

  //handle edge results
  edgeQuery(edge) {
    let resp_edge = _.get(this.state.response, ['message', 'query_graph', 'edges', edge.id()]);
    let query_edge = _.get(this.TRAPIQuery(), ['message', 'query_graph', 'edges', edge.id()]);

    let resp_source_node = _.get(this.state.response, ['message', 'query_graph', 'nodes', _.get(resp_edge, 'subject')]);
    let query_source_node = _.get(this.TRAPIQuery(), ['message', 'query_graph', 'nodes', _.get(query_edge, 'subject')]);
    console.log(resp_edge, query_edge, resp_source_node, query_source_node);

    if (_.isEqual(resp_edge, query_edge) && _.isEqual(resp_source_node, query_source_node)) { //use existing results if the query graph for the edge is unchanged
      this.setState({mode: "edge", activeItem: "BTE"});
      this.setElementID(edge.id())
    } else { //otherwise requery the graph
      this.queryGraph(() => {
        this.setState({mode: "edge", activeItem: "BTE"});
        this.setElementID(edge.id()); 
      });
      
    }
  }

  //handle node results
  nodeQuery(node) {
    let resp_node = _.get(this.state.response, ['message', 'query_graph', 'nodes', node.id()]);
    let query_node = _.get(this.TRAPIQuery(), ['message', 'query_graph', 'nodes', node.id()]);

    if (_.isEqual(resp_node, query_node)) { //use existing results if they exist
      this.setState({mode: "node", activeItem: "BTE"});
      this.setElementID(node.id());
    } else { //requery if they don't exist
      this.queryGraph(() => {
        this.setState({mode: "node", activeItem: "BTE"});
        this.setElementID(node.id());
      }); 
    }
  }

  //by default show results for first edge
  //if there is already a selected ed
  defaultQuery() {
    this.queryGraph(() => {
      let edge = this.state.cy.edges()[0];
      this.edgeQuery(edge);
    });
  }

  makeARSQuery() {
    console.log("Querying ARS...");
    if (this.isValidQuery(this.cyJSON())) {
      if (!this.state.loadingARS) {
        this.setState({loadingARS: true, activeItem: 'ARS'});

        axios.post('https://ars-dev.transltr.io/ars/api/submit', this.TRAPIQuery()).then((response) => {
          this.setState({arsPK: response.data.pk, loadingARS: false});
          console.log("ARS response", response);
        }).catch((error) => {
          console.log("Error: ", error);
        });
      }
    }
  }

  //get and query graph
  queryGraph(callback) {
    console.log("Querying...");
    if (this.isValidQuery(this.cyJSON())) {
      if (!this.state.loading) {
        this.setState({loading: true});
        let query = this.TRAPIQuery();

        axios.post('https://api.bte.ncats.io/v1/query', query).then((response) => {
          this.setState({loading: false, response: response.data}, () => {
            if (callback !== undefined) {
              callback();
            }
          });
          console.log("Response", response.data);
        }).catch((error) => {
          this.setState({loading: false});
          console.log("Error: ", error);
        });
      } else {
        console.log('Already loading.');
      }
    }
  }

  //use to intialize cy and force update
  setCy(cy) {
    this.setState({cy: cy});
  }

  render() {
    return (
      <Container className="feature">
        <Navigation name="Advanced" />
        
        <AdvancedQueryGraph ref={this.graphRef} edgeQuery={this.edgeQuery} nodeQuery={this.nodeQuery} cy={this.state.cy} setCy={this.setCy}/>
        
        <Button onClick={this.defaultQuery} loading={this.state.loading}>Query BTE</Button>
        <Button onClick={this.makeARSQuery} loading={this.state.loadingARS}>Query ARS</Button>
        
        <TRAPIQueryButton TRAPIQuery={this.TRAPIQuery}/>

        <Menu pointing secondary>
          <Menu.Item 
            name='BTE'
            active={this.state.activeItem === 'BTE'}
            onClick={this.handleMenuClick}
          />
          <Menu.Item 
            name='ARS'
            active={this.state.activeItem === 'ARS'}
            onClick={this.handleMenuClick}
          />
        </Menu>

        <div style={{display: this.state.activeItem === 'BTE' ? 'block' : 'none'}}>
          <ResultsTable 
            response={this.state.response}
            mode={this.state.mode}
            selectedElementID={this.state.selectedElementID}
            cy={this.state.cy}
            setCy={this.setCy}
            key={this.state.selectedElementID} //force creation of new element when selected element changes
          />
        </div>
        <div style={{display: this.state.activeItem === 'ARS' ? 'block' : 'none'}}>
          <ARSDisplay arsPK={this.state.arsPK} />
        </div>
      </Container>
    )
  }
}

export default AdvancedQuery;