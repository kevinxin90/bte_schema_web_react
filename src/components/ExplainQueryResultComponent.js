import D3Graph from './D3GraphComponent';
import BTETable from './BTETableComponent';
import ReactLoader from './DimerComponent';
import React, { Component } from 'react';
import { Segment, Divider, Button, Header, Icon, Image, Modal } from 'semantic-ui-react';


export default class ExplainQueryResult extends Component {

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
                    />
                    <Divider />
                    <div className={this.props.shouldHide ? '' : 'hidden'}>
                        <svg width="400" height="400">
                            <g class="links"></g>
                            <g class="nodes"></g>
                        </svg>
                        <D3Graph
                            graph={this.props.graph}
                            resultReady={this.props.resultReady}
                        />
                    </div>
                </Segment>
            </div>
        )
    }
}

