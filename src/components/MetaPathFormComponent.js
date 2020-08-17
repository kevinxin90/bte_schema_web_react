import { Button, Segment, Table } from 'semantic-ui-react'
import React from 'react';
import MetaPath from './DrawMetaPath.js';
import MetaPathLabels from './DrawMetaPathLabels';
import ErrorMessage from './DisplayErrorComponent';

export const MetaPathForm = (props) => {
    const rows = props.paths.map((path, i) => {
        return (
            <Table.Row textAlign='right' key={i}>
                <Table.Cell key={"checkbox" + i.toString()}>
                    <label>
                        <input type="checkbox"
                            name={path}
                            onChange={props.handleSelect} 
                            checked={props.selectedPaths.has(path)} /> 
                    </label>
                </Table.Cell>
                <Table.Cell key={path}><MetaPath className={path} /></Table.Cell>
            </Table.Row>
        )
    })

    return (
        <div className={props.shouldDisplay ? '' : 'hidden'}>
            <ErrorMessage field="metapath" modalOpen={props.showModal} handleClose={props.handleClose}/>
            <Segment color='red'>
                <h2> Step 2: Select the MetaPath you want to execute.</h2>
                <hr />
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}></Table.HeaderCell>
                            <Table.HeaderCell>MetaPath</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
                <p>Color Schema</p>
                <MetaPathLabels />
                <div className="col text-center">
                    <Button type='submit' onClick={props.handleBackToStep1}>Back</Button>
                    <Button type='submit' onClick={props.handleSubmit}>Continue</Button>
                </div>
            </Segment>
        </div>
    )
}


