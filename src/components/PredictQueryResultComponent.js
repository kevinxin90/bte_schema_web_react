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
                    {this.props.resultReady && this.props.content.length === 0 ? <h2>Sorry, no results could be found for your query. Please refine your search!</h2> : ''}
                    
                    {this.props.resultReady && this.props.content.length > 0? 
                    <div>
                        <h2> Step 3: Select the Query Result you want to display.</h2>
                        <hr />
                        <Modal trigger={<Button basic color="red">Query Execution Logs</Button>} closeIcon>
                            <Modal.Header>Query Execution Logs</Modal.Header>
                            <Modal.Description>
                                {paragraphs}
                            </Modal.Description>
                        </Modal><br></br><br></br>
                    </div> : null}
                    
                    {this.props.resultReady ? null: <ReactLoader />}
                    {this.props.resultReady && this.props.content.length > 0 ? <BTETable
                        resultReady={this.props.resultReady}
                        content={this.props.content}
                        handleSelect={this.props.handleSelect}
                        table={this.props.table}
                        handleSort={this.props.handleSort}
                        handlePaginationChange={this.props.handlePaginationChange}
                    /> : null}
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

