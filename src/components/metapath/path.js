import React from 'react';
import BranchList from './branchList';
import { Button, Popup } from 'semantic-ui-react';
import Warning from './warning';

function Path(props) {

    return (
        <div className="path">
            <div>
                <Popup
                    content='Each branch represents a different metapath which will be queried.'
                    on='hover'
                    trigger={<Button className="addBranch" onClick={props.addBranch}>+ ADD BRANCH</Button>}
                    mouseEnterDelay={1000}
                    position='right center'
                    size='mini'
                />
            </div>
            <BranchList branches={props.branches} 
                        addInter={props.addInter}
                        removeBranch={props.removeBranch}/>
            <div className={props.branchCheck.length === 0? 'hidden' : 'branchWarning'}>
                <Warning branchCheck={props.branchCheck}/>
            </div>
        </div>
    );
    
}

export default Path;