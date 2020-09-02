import React from 'react';
import { Icon } from 'semantic-ui-react';

export default function Warning(props) {
    
    const sameBranches = props.branchCheck.map((sames, index) => 
        <div key={index}>Path {sames.branch1} and Path {sames.branch2}</div>
    )

    return (
        <div className='ui warning message'>
            <div className='header'>
                <Icon name='warning circle'/>
                The following paths are the same:
            </div>
            {sameBranches}
        </div>
    );
}