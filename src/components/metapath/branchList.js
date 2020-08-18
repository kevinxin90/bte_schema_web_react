import React from 'react'
import Branch from './branch'
import { Divider } from 'semantic-ui-react';

export default function BranchList(props) {
    return (
        props.branches.map(branch => {
            return <div>
                        <Branch  key={branch.id} 
                            branch={branch} 
                            addInter={props.addInter}
                            removeBranch={props.removeBranch}
                            addFilter={props.addFilter}
                            filterSuccess={props.filterSuccess}
                            filterError={props.filterError}
                            closeFilter={props.closeFilter}
                        />
                        <div className="branchDivider">
                            <Divider />
                        </div>
                    </div>
        })
    )
}