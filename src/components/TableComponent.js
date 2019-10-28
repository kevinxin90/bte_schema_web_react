import React from 'react';
import { Table } from 'reactstrap';

function RenderTable({semantic_type, fields, content}) {
    return (
        <React.Fragment>
            <h3>{semantic_type}</h3>
            <Table responsive className="table table-striped table-bordered table-hover">
                
                <thead class="thead-dark">
                    <tr>
                        {fields.map((field, index) => (
                            <th key={semantic_type + field + index}>{field}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {content.map((record, index) => (
                        <tr key={semantic_type + record + index}>
                            {record.map((item) => (
                                <td key={semantic_type + item + index}> {item} </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </React.Fragment>
    )
}

export default RenderTable;