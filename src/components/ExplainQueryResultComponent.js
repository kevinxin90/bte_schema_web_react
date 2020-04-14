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
                    <h2> Step 3: Select the Query Result you want to display.</h2>
                    <hr />
                    {this.props.resultReady ? <div><Modal trigger={<Button basic color="red">Query Execution Logs</Button>} closeIcon>
                        <Modal.Header>Query Execution Logs</Modal.Header>
                        <Modal.Description>
                            {paragraphs}
                        </Modal.Description>
                    </Modal><br></br><br></br></div> : null}
                    
                    {this.props.resultReady ? null: <ReactLoader />}
                    <BTETable
                        resultReady={this.props.resultReady}
                        handleSelect={this.props.handleSelect}
                        content={this.props.content}
                        table={this.props.table}
                        handleSort={this.props.handleSort}
                        handlePaginationChange={this.props.handlePaginationChange}
                    />
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

