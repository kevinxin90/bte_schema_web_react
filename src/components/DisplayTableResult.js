import _ from 'lodash'
import React from 'react'
import { Table, Pagination, Checkbox, Icon, Popup, Accordion, Form, Button, Menu } from 'semantic-ui-react'
import { getPublicationLink } from '../shared/utils'

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
                                        <Table.Cell key={`cell-${_.uniqueId()}`} collapsing>
                                            <div>
                                                <a href={getPublicationLink(item[col])} target="_blank" rel="noopener noreferrer">Publications ({item[col].length})&nbsp;&nbsp;<Icon name='external alternate' /></a>
                                            </div>
                                        </Table.Cell>
                                    );
                                } else if (col.includes("_id")) { //show popup 
                                    return (
                                        <Popup trigger={
                                                <Table.Cell key={`cell-${_.uniqueId()}`}>
                                                    {item[col]}
                                                </Table.Cell>
                                            }
                                            key={`popup-${_.uniqueId()}`}
                                            hoverable
                                            popperModifiers={{
                                                preventOverflow: {
                                                    boundariesElement: "viewport"
                                                }
                                            }}
                                        >
                                            <Popup.Header>Equivalent IDs</Popup.Header>
                                            <Popup.Content>
                                                {
                                                    Object.keys(props.equivalentIds[item[col]])
                                                    .filter(key => !["primary", "display", "type", "name"].includes(key)) //ignore primary, display, and type fields
                                                    .map((key) => <p style={{marginBottom: 0, marginTop: 5}} key={`p-${_.uniqueId()}`}>{`${key}: ${props.equivalentIds[item[col]][key]}`}</p>)
                                                }
                                            </Popup.Content>
                                        </Popup>
                                        
                                        
                                    );
                                } else {
                                    return (
                                        <Table.Cell key={`cell-${_.uniqueId()}`}>
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
