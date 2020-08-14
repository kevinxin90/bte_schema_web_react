import React from 'react';

export default function Warning(props) {
    
    const sameBranches = props.branchCheck.map((sames, index) => 
        <div key={index}>Branch {sames.branch1} and Branch {sames.branch2}</div>
    )

    return (
        <div className='ui warning message'>
            <div className='header'>
                <i className='warning circle icon'></i>
                The following branches are the same:
            </div>
            {sameBranches}
        </div>
    );
}