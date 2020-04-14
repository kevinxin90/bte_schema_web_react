import BTETable from './BTETableComponent';
import ReactLoader from './DimerComponent';
import React, { Component } from 'react';
import { Segment, Divider, Modal, Button } from 'semantic-ui-react';
import TreeGraph from './TreeGraphComponent';

export default class PredictQueryResult extends Component {
    render() {
        const paragraphs = this.props.logs.map((log) => {
            return (
                <p>{log}</p>
            )
        })

        return (
            <div className={this.props.shouldHide ? '' : 'hidden'}>
                <Segment color='blue'>
                    <h2> Step 3: Select the Query Result you want to display.</h2>
                    <hr />
                    {this.props.resultReady ? <Modal trigger={<Button basic color="red">Query Execution Logs</Button>} closeIcon>
                        <Modal.Header>Query Execution Logs</Modal.Header>
                        <Modal.Description>
                            {paragraphs}
                        </Modal.Description>
                    </Modal> : null}
                    <br></br><br></br>
                    {this.props.resultReady ? null: <ReactLoader />}
                    <BTETable
                        resultReady={this.props.resultReady}
                        content={this.props.content}
                        handleSelect={this.props.handleSelect}
                        table={this.props.table}
                        handleSort={this.props.handleSort}
                        handlePaginationChange={this.props.handlePaginationChange}
                    />
                    <Divider />
                    {Object.keys(this.props.graph).length === 0 ? null: 
                        <TreeGraph
                            graph={this.props.graph}
                            resultReady={this.props.resultReady}
                        />
                    }           
                </Segment>
            </div>
        )
    }
}

