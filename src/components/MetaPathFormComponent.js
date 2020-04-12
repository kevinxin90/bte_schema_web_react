import { Button, Form, Segment, Checkbox, Table } from 'semantic-ui-react'
import React, { Component } from 'react';
import Viz from './Viz.js';
import LabelViz from './VizLabel';


class MetaPathForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPath: ''
        }
    }



    render() {
        const radios1 = this.props.paths.map((path) => {
            return (
                <Form.Field key={path} label={path} name={path} value={path} control='input' type='checkbox' onChange={this.props.handleSelect}></Form.Field>
            );
          });
        
          const radios2 = this.props.paths.map((path) => {
            return (
                <li>
                    <Checkbox><label><Viz className={path} /></label></Checkbox>
                    
                </li>
            );
          });
        const radios = this.props.paths.map((path) => {
            return (
                <Table.Row textAlign='right'>
                    <Table.Cell>
                        <label>
                            <input type="checkbox"
                                name={path}
                                onChange={this.props.handleSelect} 
                                defaultChecked={false} /> 
                        </label>
                    </Table.Cell>
                    <Table.Cell><Viz className={path} /></Table.Cell>
                </Table.Row>
            )
        })

        return (
            <div className={this.props.shouldHide ? '' : 'hidden'}>
                <div className="row">
                    <div className="col-12">
                        <Segment color='red'>
                            <h2> Step 2: Select the MetaPath you want to execute.</h2>
                            <hr />
                            <Table singleLine>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}></Table.HeaderCell>
                                        <Table.HeaderCell>MetaPath</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {radios}
                                </Table.Body>
                            </Table>
                            <p>Color Schema</p>
                            <LabelViz />
                            <div className="col text-center">
                                <Button type='submit' onClick={this.props.handleBackToStep1}>Back</Button>
                                <Button type='submit' onClick={this.props.handleSubmit}>Continue</Button>
                            </div>
                        </Segment>
                    </div>
                </div>
            </div>
        )
    }
}


export default MetaPathForm
