import _, { find } from 'lodash'
import React, { Component } from 'react'
import { Table, Pagination, Checkbox, Icon, Popup, Accordion, Form, Button, Menu, HeaderContent } from 'semantic-ui-react'
import { getPublicationLink } from '../shared/utils';
import { findSmartAPIEdgesByInputAndOutput } from '../shared/utils';

class BTETable extends Component {

    render() {

        const tables = this.props.branch.path.map((item, i) => {

            let header = <h3>Step {i+1}</h3>
            
            if (this.props.queryResults && this.props.queryResults !== "l"){
                if (this.props.queryResults.length >= i+1) {
                    if (this.props.queryResults[i].length === 0){
                        return (
                            <div className="result">
                                {header}
                                <div>Sorry, no results were found for this step in the query.</div>
                            </div>
                        );
                    } else {

                        const headers = Object.keys(this.props.display[i][0]);

                        return (
                            <div className="result">
                                {header}
                                <div style={{overflowX: "auto", marginBottom: "1em", marginTop: "0.5em"}}>
                                    <Table sortable unstackable celled compact>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Display</Table.HeaderCell>
                                                {_.map(headers, (item) => (
                                                    <Table.HeaderCell
                                                        key={item}
                                                        className={item}
                                                        value={item}
                                                    // sorted={props.table.column === item ? props.table.direction : null}
                                                    // onClick={this.props.handleSort}
                                                    >
                                                        {item}
                                                    </Table.HeaderCell>
                                                ))}
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {_.map(this.props.display[i], (item) => (
                                            <Table.Row key={Object.values(item).join('||') + _.uniqueId()}>
                                                <Table.Cell key='checkbox' textAlign='center'>
                                                    <Checkbox toggle
                                                        name={Object.values(item).join('||')}
                                                        onClick={this.props.handleSelect}
                                                        checked={this.props.selectedQueryResults.has(Object.values(item).join('||'))}
                                                    /> 
                                                </Table.Cell>
                                                {_.map(headers, (col, j) => {
                                                    if (Array.isArray(item[col])) { //if the item is an array, make it a space separated string (only applies to publications)
                                                        return ( // use collapsing to prevent icon from wrapping
                                                            <Table.Cell key={j} collapsing>
                                                                <div>
                                                                    <a href={getPublicationLink(item[col])} target="_blank" rel="noopener noreferrer">Publications ({item[col].length})&nbsp;&nbsp;<Icon name='external alternate' /></a> 
                                                                </div>
                                                            </Table.Cell>
                                                        );
                                                    } else {
                                                        return (
                                                            <Table.Cell key={j}>
                                                                {item[col]}
                                                            </Table.Cell>
                                                        );
                                                    }
                                                })}
                                            </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                                <Pagination
                                    onPageChange={(e,page) => this.props.handlePaginationChange(e, page, this.props.branch.id - 1, i)}
                                    defaultActivePage={1}
                                    totalPages={this.props.totalPages[i]}
                                    siblingRange={1}
                                />
                            </div>
                        );
                    }
                } else {
                    var b = this.props.branch.path[i];
                    if (i === 0){
                        var a = this.props.branch.source.type;
                        var edges = findSmartAPIEdgesByInputAndOutput(a, b);
                    } else {
                        var a = this.props.branch.path[i-1];
                        var edges = findSmartAPIEdgesByInputAndOutput(a, b);
                    }

                    let apis = new Set(edges.map(edge =>  edge.association.api_name ));
                    
                    return (
                        <div className="result">
                            {header}
                            <div>We are currently querying the following APIs to connect you from {a} to {b}: <br/> {Array.from(apis).join(', ')}</div>
                        </div>
                    );
                }
            } else {
                var b = this.props.branch.path[i];
                if (i === 0){
                    var a = this.props.branch.source.type;
                    var edges = findSmartAPIEdgesByInputAndOutput(a, b);
                } else {
                    var a = this.props.branch.path[i-1];
                    var edges = findSmartAPIEdgesByInputAndOutput(a, b);
                }

                let apis = new Set(edges.map(edge =>  edge.association.api_name ));

                return (
                    <div className="result">
                        {header}
                        <div>We are currently querying the following APIs to connect you from {a} to {b}: <br/> {Array.from(apis).join(', ')}</div>
                    </div>
                );
            }
            


        });
        
    
        return (
            <div>
                <h2>Your Query Results:</h2>
                {tables}
            </div>
        );
    }
}

export default BTETable;

{/*
export default function BTETable(props) {
    const headers = props.table.display.length > 0 ? Object.keys(props.table.display[0]) : [];

    const panels = Object.keys(props.filterOptions).map((field) => (
        {
            key: field,
            title: field,
            content: {
                content: (
                    <Form>
                        <Form.Group grouped>
                            {
                                props.filterOptions[field].map((option) => (
                                    <Form.Checkbox onChange={props.handleFilterSelect} label={option} name={field} value={option} defaultChecked={props.filter[field].has(option)} key={`${field}-${option}`}/>
                                ))
                            }
                            
                        </Form.Group>
                    </Form>
                )
            }
        }
    ));

    console.log(props.queryResults);

        
    return (
        <div>
            <h3>Your Query Results</h3>
            <Popup 
                trigger={<Button content='Filter Results' icon='filter' labelPosition='left' />}
                flowing
                pinned
                position='bottom left'
                on='click'
            >
                <Accordion as={Menu} secondary vertical panels={panels}/>
            </Popup>
           
            <div style={{overflowX: "auto", marginBottom: "1em", marginTop: "0.5em"}}>
                <Table sortable unstackable celled compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Display</Table.HeaderCell>
                            {_.map(headers, (item) => (
                                <Table.HeaderCell
                                    key={item}
                                    className={item}
                                    value={item}
                                    sorted={props.table.column === item ? props.table.direction : null}
                                    onClick={props.handleSort}
                                >
                                    {item}
                                </Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {_.map(props.table.display, (item) => (
                        <Table.Row key={Object.values(item).join('||') + _.uniqueId()}>
                            <Table.Cell key='checkbox' textAlign='center'>
                                <Checkbox toggle
                                    name={Object.values(item).join('||')}
                                    onClick={props.handleSelect}
                                    checked={props.selectedQueryResults.has(Object.values(item).join('||'))}
                                /> 
                            </Table.Cell>
                            {_.map(headers, (col, i) => {
                                if (Array.isArray(item[col])) { //if the item is an array, make it a space separated string (only applies to publications)
                                    return ( // use collapsing to prevent icon from wrapping
                                        <Table.Cell key={i} collapsing>
                                            <div>
                                                Publication Link here (fix)
                                                <a href={getPublicationLink(item[col])} target="_blank" rel="noopener noreferrer">Publications ({item[col].length})&nbsp;&nbsp;<Icon name='external alternate' /></a> 
                                            </div>
                                        </Table.Cell>
                                    );
                                } else {
                                    return (
                                        <Table.Cell key={i}>
                                            {item[col]}
                                        </Table.Cell>
                                    );
                                }
                            })}
                        </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <Pagination
                onPageChange={props.handlePaginationChange}
                defaultActivePage={1}
                totalPages={props.table.totalPages}
                siblingRange={2}
                // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
            />
        </div>
    )
}
*/}