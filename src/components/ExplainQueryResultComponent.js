import D3Graph from './D3GraphComponent';
import BTETable from './BTETableComponent';
import ReactLoader from './DimerComponent';
import React, { Component } from 'react';
import { Segment, Divider, Dimmer, Loader, Image } from 'semantic-ui-react';


export default class ExplainQueryResult extends Component {
    render() {
        return (
            <div className={this.props.shouldHide ? '' : 'hidden'}>
                <div className="row">
                    <div className="col-12">
                        <Segment color='blue'>
                            {this.props.resultReady ? null: <ReactLoader />}
                            <BTETable
                                resultReady={this.props.resultReady}
                                content={this.props.content}
                                handleSelect={this.props.handleSelect}
                            />
                            <Divider />
                            <div className={this.props.shouldHide ? '' : 'hidden'}>
                                <D3Graph
                                    graph={this.props.graph}
                                    resultReady={this.props.resultReady}
                                />
                            </div>
                        </Segment>
                    </div>
                </div>
            </div>
        )
    }
}

