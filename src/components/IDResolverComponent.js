import React, { Component } from 'react';
import { Row, Col, Form, FormGroup, Label,
         BreadcrumbItem, Breadcrumb } from 'reactstrap';
import { Input, Select, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import IDResolverTable from './IDResolverTableComponent';

class IDResolver extends Component {

    constructor(props) {
        super(props);

        this.state = {
            resolverInput: '',
            hintResult: {},
            showHint: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('https://biothings.io/explorer_kgs/api/v1/hint?q=' + this.state.resolverInput)
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
                    ['hintResult']: response,
                    ['showHint']: true
                });
            })
            .catch(error => { console.log('post comments', error.message); alert('Your comment could not be posted\nError: '+error.message); });
    }

    render() {
        const options = [
          { key: 'all', text: 'All', value: 'all' },
          { key: 'articles', text: 'Articles', value: 'articles' },
          { key: 'products', text: 'Products', value: 'products' },
        ]
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>ID Resolver</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>Identifier Resolver</h3>
                        <hr />
                    </div>
                </div>
                <div className="row idresolver_form">
                    <Form className="col-12" onSubmit={this.handleSubmit}>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Input 
                                        icon='search'
                                        action="search"
                                        name="resolverInput" 
                                        id="resolverInput" 
                                        placeholder="Type your ID/name here!"
                                        value={this.state.resolverInput}
                                        onChange={this.handleInputChange} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="row">
                    <div className="showhint" style={{display: this.state.showHint ? 'block' : 'none' }}>
                        <h2> Here are the hits from your search grouped by semantic types</h2>
                    </div>
                </div>
                <div className="row">
                    <IDResolverTable content={this.state.hintResult} />
                </div>
            </div>
        )
    }
}

export default IDResolver;