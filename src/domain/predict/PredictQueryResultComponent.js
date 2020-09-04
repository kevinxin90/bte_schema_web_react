import ReactLoader from '../../components/DimerComponent';
import React, { Component } from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import BTETable from '../../components/DisplayTableResult';

export default class PredictQueryResult extends Component {
    render() {
        const paragraphs = this.props.logs.map((log) => {
            return (
                <p>{log}</p>
            )
        }) 

        

        // let panes = [
        //     { menuItem: 'Tab 1', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        //     { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
        //     { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
        // ]
        let panes = this.props.branches.map((item, i) => {
            return {
                menuItem: 'Path ' + (i + 1),
                render: () =>
                    <Tab.Pane>
                        <p>{'Path ' + (i + 1)}</p>
                        <BTETable
                            handleSelect={this.props.handleSelect}
                            table={this.props.table}
                            handleSort={this.props.handleSort}
                            filter={this.props.filter}
                            filterOptions={this.props.filterOptions}
                            handleFilterSelect={this.props.handleFilterSelect}
                            handlePaginationChange={this.props.handlePaginationChange}
                            selectedQueryResults={this.props.selectedQueryResults}
                        />
                    </Tab.Pane>
            }
        })

        return (
            <div className={this.props.shouldDisplay ? '' : 'hidden'}>
                <Segment color='blue'>
                    <Tab panes={panes} />
                </Segment>
            </div>
        )
    }
}

