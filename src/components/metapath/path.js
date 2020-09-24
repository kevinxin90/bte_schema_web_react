import React from 'react';
import BranchList from './branchList';
import { Button, Popup, Icon } from 'semantic-ui-react';
import Warning from './warning';
import ModalSection from './modalSection';

function Path(props) {

    return (
        <div className="path">
            <div>
                <Popup // hover over 'add branch' button
                    content='Each path (max 3) represents a different metapath which will be queried.'
                    on='hover'
                    trigger={<Button className="addBranch" onClick={props.addBranch}>+ ADD PATH</Button>}
                    mouseEnterDelay={500}
                    position='right center'
                    size='mini'
                />
                <Popup // hover over help icon
                    content='Get started by adding a node to your first path (max 3 additional nodes per path). Once added, you may apply filters, 
                            which can be applied between any two nodes. When adding filters, please select one item from each category.'
                    on='hover'
                    trigger={<Icon name='help circle' className='helpIcon' size='large'/>}
                    position='left center'
                    size='small'
                    wide='very'
                />
            </div>
            <BranchList branches={props.branches} 
                        addNode={props.addNode}
                        removeBranch={props.removeBranch}
                        addFilter={props.addFilter}
                        filterSuccess={props.filterSuccess}
                        filterError={props.filterError}
                        filterPredError={props.filterPredError}
                        filterCountError={props.filterCountError}
                        closeFilter={props.closeFilter}/>
            <div className={["mobile only", "toggleGraph", "tablet only"].join(' ')}
                // mobile only graph component
            > 
                <ModalSection branches={props.branches} source={props.source} />
            </div>
            <div className={props.branchCheck[0].length === 0? 'hidden' : 'branchWarning'}>
                <Warning branchCheck={props.branchCheck} />
            </div>
        </div>
    );
    
}

export default Path;