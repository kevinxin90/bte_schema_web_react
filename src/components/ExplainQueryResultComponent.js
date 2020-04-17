import D3Graph from './D3GraphComponent';
import BTETable from './BTETableComponent';
import ReactLoader from './DimerComponent';
import React, { Component } from 'react';
import { Segment, Divider, Button,  Modal } from 'semantic-ui-react';


export default class ExplainQueryResult extends Component {

    render() {
        const paragraphs = this.props.logs.map((log, i) => {
            return (
                <p key={i}>{log}</p>
            )
        })

        return (
            <div className={this.props.shouldHide ? '' : 'hidden'}>
                <Segment color='blue'>
                    {this.props.resultReady && this.props.content.length === 0 ? <h2>Sorry, no results could be found for your query. Please refine your search!</h2> : ''}
                    
                    {this.props.resultReady && this.props.content.length > 0? <div>
                        <h2> Step 3: Select the Query Result you want to display.</h2>
                        <hr />
                        <Modal trigger={<Button basic color="red">Query Execution Logs</Button>} closeIcon>
                        <Modal.Header>Query Execution Logs</Modal.Header>
                        <Modal.Description>
                            {paragraphs}
                        </Modal.Description>
                    </Modal><br></br><br></br></div> : null}
                    
                    {this.props.resultReady ? null: <ReactLoader />}
                    {this.props.resultReady && this.props.content.length > 0 ? <BTETable
                        resultReady={this.props.resultReady}
                        handleSelect={this.props.handleSelect}
                        content={this.props.content}
                        table={this.props.table}
                        handleSort={this.props.handleSort}
                        handlePaginationChange={this.props.handlePaginationChange}
                    /> : null}
                    <Divider />
                    {this.props.graph.links.length === 0 ? null: 
                        <D3Graph
                            graph={this.props.graph}
                            resultReady={this.props.resultReady}
                    /> }
                </Segment>
            </div>
        )
    }
}

