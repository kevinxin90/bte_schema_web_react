import BTETable from '../../components/DisplayTableResult';
import ReactLoader from '../../components/DimmerComponent';
import React, { Component } from 'react';
import { Segment, Divider, Modal, Button } from 'semantic-ui-react';
import TreeGraph from '../../components/TreeGraphComponent';

export default class PredictQueryResult extends Component {
    render() {
        const paragraphs = this.props.logs.map((log) => {
            return (
                <p>{log}</p>
            )
        })

        return (
            <div className={this.props.shouldDisplay ? '' : 'hidden'}>
                <Segment color='blue'>
                    {this.props.resultReady ? null: <ReactLoader message="The results may take a few minutes to show up."  />}
                    {this.props.resultReady && this.props.content.length === 0 ? <h2 className="emptyQueryResult">Sorry, no results could be found for your query. Please refine your search!</h2> : ''}
                    
                    {this.props.resultReady && this.props.content.length > 0? 
                    <div>
                        <h2> Step 3: Select the Query Result you want to display.</h2>
                        <hr />
                        <Modal trigger={<Button basic color="red" className="logButton">Query Execution Logs</Button>} closeIcon>
                            <Modal.Header>Query Execution Logs</Modal.Header>
                            <Modal.Description>
                                {paragraphs}
                            </Modal.Description>
                        </Modal>
                        <BTETable
                            resultReady={this.props.resultReady}
                            content={this.props.content}
                            handleSelect={this.props.handleSelect}
                            table={this.props.table}
                            handleSort={this.props.handleSort}
                            handlePaginationChange={this.props.handlePaginationChange}
                        />
                        <Divider />
                    </div> : null}
                    {Object.keys(this.props.graph).length === 0 ? null: 
                        <TreeGraph graph={this.props.graph} />
                    }           
                </Segment>
            </div>
        )
    }
}

