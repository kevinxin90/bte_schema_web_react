import BTETable from '../../components/DisplayTableResult';
import ReactLoader from '../../components/DimerComponent';
import React, { Component } from 'react';
import { Segment, Divider, Button,  Modal } from 'semantic-ui-react';
import CytoscapeGraph from '../../components/CytoscapeGraphComponent';

export default class ExplainQueryResult extends Component {

    render() {
        const paragraphs = this.props.logs.map((log, i) => {
            return (
                <p key={i}>{log}</p>
            )
        })

        return (
            <div className={this.props.shouldDisplay ? '' : 'hidden'}>
                <Segment color='blue'>
                    {this.props.resultReady ? null: <ReactLoader />}
                    {this.props.resultReady && this.props.content.length === 0 ? <h2 className="emptyQueryResult">
                        Sorry, no results could be found for your query. Please refine your search!</h2> : ''}
                    {this.props.resultReady && this.props.content.length > 0? <div>
                        <h2> Step 3: Select the Query Result you want to display.</h2>
                        <hr />
                        <Modal trigger={<Button basic color="red" className="logButton">Query Execution Logs</Button>} closeIcon>
                            <Modal.Header>Query Execution Logs</Modal.Header>
                            <Modal.Description>
                                {paragraphs}
                            </Modal.Description>
                        </Modal>
                        <BTETable
                            handleSelect={this.props.handleSelect}
                            table={this.props.table}
                            handleSort={this.props.handleSort}
                            filter={this.props.filter}
                            filterOptions={this.props.filterOptions}
                            handleFilterSelect={this.props.handleFilterSelect}
                            handlePaginationChange={this.props.handlePaginationChange}
                            selectedQueryResults={this.props.selectedQueryResults}
                            equivalentIds={this.props.equivalentIds}
                        />
                        <Divider />
                    </div> : null}
                    
                    <CytoscapeGraph ref={this.props.graphRef} />
                </Segment>
            </div>
        )
    }
}