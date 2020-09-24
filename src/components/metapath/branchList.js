import React from 'react'
import Branch from './branch'
import { Divider } from 'semantic-ui-react';

export default function BranchList(props) {

    const disableRemove = props.branches.length === 1 && props.branches[0].path.length === 0;

    return (
        // mapping each branch to its own branch component
        props.branches.map(branch => {
            return <div>
                        <Branch  
                            key={branch.id} 
                            branch={branch} 
                            addNode={props.addNode}
                            removeBranch={props.removeBranch}
                            addFilter={props.addFilter}
                            filterSuccess={props.filterSuccess}
                            filterError={props.filterError}
                            closeFilter={props.closeFilter}
                            filterPredError={props.filterPredError}
                            filterCountError={props.filterCountError}
                            disableRemove={disableRemove}
                        />
                        <div className="branchDivider">
                            <Divider />
                        </div>
                    </div>
        })
    )
}