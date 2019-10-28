import React, { Component } from 'react';
import { BreadcrumbItem, Breadcrumb } from 'reactstrap';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import AutoComplete from './AutoCompleteComponent';
import SingleHopTable from './SingleHopTableComponent';
import { Button, Form, Segment, Dropdown } from 'semantic-ui-react'
import VisJsGraph from './VisJsGraphComponent';

class SingleHop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedInput: {},
            output: [],
            response: {},
            showHint: false,
            options: [],
            nodes: [
                { id: 1, label: "Node 8", color: "#e04141" },
                { id: 2, label: "Node 2", color: "#e09c41" },
                { id: 3, label: "Node 3", color: "#e0df41" },
                { id: 4, label: "Node 4", color: "#7be041" },
                { id: 5, label: "Node 5", color: "#41e0c9" }
            ],
            edges: [{ from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 2, to: 5 }]
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputSelect = this.handleInputSelect.bind(this);
    };

    componentDidMount() {
        fetch('https://biothings.io/explorer_kgs/api/v1/semantictypes')
            .then(response => {
                if (response.ok) {
                    return response;
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statsText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
            .then(response => response.json())
            .then(response => {
                var options = _.map(response, (item) => ({
                    key: item,
                    value: item,
                    text: item
                }));
                this.setState({
                    options: options
                })
            })
    }

    //this function will be passed to autocomplete component
    //in order to retrieve the selected input
    handleInputSelect(value) {    
        this.setState({
          selectedInput: value
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleDropDownChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit(event) {
        event.preventDefault();
        fetch('https://biothings.io/explorer_kgs/api/v1/single_hop_query?input_obj=' + JSON.stringify(this.state.selectedInput) + '&output_cls=' + JSON.stringify(this.state.output))
            .then(response => {
                if (response.ok) {
                    return response;
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statsText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    response: response,
                    nodes: response.nodes,
                    edges: response.links
                });
            })
            .catch(error => { console.log('post comments', error.message); alert('Your comment could not be posted\nError: '+error.message); });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Single Hop Query</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h2>Single Hop Query</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Segment inverted>
                            <Form inverted onSubmit={this.handleSubmit}> 
                                <Form.Group>
                                    <AutoComplete handleinputselect={this.handleInputSelect}/>   
                                </Form.Group>
                                <Form.Group>
                                    <div>
                                        <p>Output Types</p>
                                    </div>    
                                    <Dropdown placeholder='Gene' onChange={this.handleDropDownChange} name="output" fluid multiple selection options={this.state.options} />
                                </Form.Group>
                                <div className="col text-center">
                                    <Button type='submit'>Search</Button>
                                </div>
                            </Form>
                        </Segment>
                    </div>
                </div>
                <div className="row">
                    <div className="showhint" style={{display: this.state.showHint ? 'block' : 'none' }}>
                        <h2> Here are the hits from your search grouped by semantic types</h2>
                    </div>
                </div>
                <div className="row">
                    <VisJsGraph nodes={this.state.nodes} edges={this.state.edges} />
                </div>
                <div className="row">
                    <SingleHopTable content={this.state.edges} />
                </div>

            </div>
        )
    }
}

export default SingleHop;