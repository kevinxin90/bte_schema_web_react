import React from 'react';
import BranchList from './branchList';
import { Button, Popup, Icon } from 'semantic-ui-react';
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
                <Popup
                    content='You may add a maximum of 2 intermediate nodes per branch. Filters can be applied at any intermediate
                            node or the target node. When adding filters, please select one item from each category.'
                    on='hover'
                    trigger={<Icon name='help circle' className='helpIcon' size='large'/>}
                    position='left center'
                    size='small'
                    wide='very'
                />
            </div>
            <BranchList branches={props.branches} 
                        addInter={props.addInter}
                        removeBranch={props.removeBranch}
                        addFilter={props.addFilter}
                        filterSuccess={props.filterSuccess}
                        filterError={props.filterError}
                        closeFilter={props.closeFilter}/>
            <div className={props.branchCheck.length === 0? 'hidden' : 'branchWarning'}>
                <Warning branchCheck={props.branchCheck}/>
            </div>
        </div>
    );
    
}

export default Path;