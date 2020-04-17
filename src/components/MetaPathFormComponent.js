import { Button, Segment, Table } from 'semantic-ui-react'
import React, { Component } from 'react';
import Viz from './Viz.js';
import LabelViz from './VizLabel';
import ModalExampleControlled from './NoInpuModalComponent';



class MetaPathForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPath: ''
        }
    }



    render() {
        const rows = this.props.paths.map((path, i) => {
            return (
                <Table.Row textAlign='right' key={i}>
                    <Table.Cell key="checkbox">
                        <label>
                            <input type="checkbox"
                                name={path}
                                onChange={this.props.handleSelect} 
                                defaultChecked={false} /> 
                        </label>
                    </Table.Cell>
                    <Table.Cell key={path}><Viz className={path} /></Table.Cell>
                </Table.Row>
            )
        })

        return (
            <div className={this.props.shouldHide ? '' : 'hidden'}>
                <ModalExampleControlled field="metapath" modalOpen={this.props.showModal} handleClose={this.props.handleClose}/>
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
                            {rows}
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
        )
    }
}


export default MetaPathForm
