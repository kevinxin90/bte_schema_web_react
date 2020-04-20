import React, { Component } from 'react';
import AutoComplete from '../../components/AutoCompleteComponent';
import SearchSemanticTypeComponent from '../../components/SemanticTypesAutocompleteComponent';
import { Form, Button, Segment, Popup } from 'semantic-ui-react';
import ErrorMessage from '../../components/DisplayErrorComponent';

export default class PredictInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autocomplete1: {
                isLoading: false,
                results: [],
                value: ''
            },
        };
        this.handleSearchChange1 = this.handleSearchChange1.bind(this);
    }

    handleSearchChange1 = (e, { value }) => {
        this.setState({
            autocomplete1: {
                ...this.state.autocomplete1,
                isLoading: true,
                value
            }
        })
        fetch('https://geneanalysis.ncats.io/explorer_api/v1/hint?q=' + value)
        .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return {}
        }})
        .then(response => {
            var new_response = {};
            for (var semantic_type in response) {
                if (response[semantic_type].length > 0) {
                new_response[semantic_type] = {name: semantic_type, results: []};
                var content = response[semantic_type].map(function(record, i) {
                    return {
                        ...record, 
                        'title': record['name'], 
                        'description': record['display'],
                        'key': record['name'] + i.toString()
                    }
                });
                new_response[semantic_type]['results'] = content;
                }
            }
            this.setState({
                autocomplete1: {
                    ...this.state.autocomplete1,
                    isLoading: false,
                    results: new_response
                }
            })
        })
    }

    render() {
        return (
            <div className={this.props.shouldDisplay ? '' : 'hidden'}>
                <ErrorMessage field='input/output' modalOpen={this.props.showModal} handleClose={this.props.handleClose} />
                <Segment color="green">
                    <Form onSubmit={this.props.handleStep1Submit}>
                        <Form.Group>
                            <h2> Step 1: Specify source and target nodes.</h2>
                            <hr />
                        </Form.Group>
                        <div>
                            <Popup content="The starting node of the paths" trigger={<h3>Source Node</h3>}/>
                        </div>
                        <br />
                        <Form.Group>
                            <AutoComplete 
                                handleselect={this.props.handleInputSelect}
                                handleSearchChange={this.handleSearchChange1}
                                state={this.state.autocomplete1}
                            />
                        </Form.Group>
                        <div>
                            <Popup content="The ending node of the paths" trigger={<h3>Target Node</h3>}/>
                        </div>
                        <br />
                        <Form.Group>
                            <SearchSemanticTypeComponent 
                                handleSelect={this.props.handleOutputSelect}
                            />
                        </Form.Group>
                        <div className="col text-center">
                            <Button type='submit' onClick={this.props.handleStep1Submit}>Continue</Button>
                        </div>
                    </Form>
                </Segment>
            </div>
        )
    }
}

