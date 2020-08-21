import { Button, Segment } from 'semantic-ui-react'
import React from 'react';
import ErrorMessage from './DisplayErrorComponent';
import BranchErrorMessage from './DisplayBranchError';
import Metapath from './metapath/metapath';

export const PredictMetapath = (props) => {

    return (
        <div className={props.shouldDisplay ? '' : 'hidden'}>
            <ErrorMessage   field="metapath" 
                            modalOpen={props.showModal} 
                            handleClose={props.handleClose}/>
            <BranchErrorMessage  
                            modalOpen={props.showBranchModal} 
                            handleClose={props.handleBranchClose}
                            handleContinue={props.handleContinueBranches}/>
            <Segment color='red'>
                <h2> Step 2: Select the MetaPath you want to execute.</h2>
                <Metapath 
                    source={props.selectedInput} 
                    //output={props.selectedOutput} 
                    addBranch={props.addBranch} 
                    branches={props.branches}
                    addNode={props.addNode}
                    branchCheck={props.branchCheck}
                    removeBranch={props.removeBranch}
                    addFilter={props.addFilter}
                    filterSuccess={props.filterSuccess}
                    filterError={props.filterError}
                    filterPredError={props.filterPredError}
                    filterCountError={props.filterCountError}
                    closeFilter={props.closeFilter}/>
                <div className="col text-center">
                    <Button type='submit' onClick={props.handleBackToStep1}>Back</Button>
                    <Button type='submit' onClick={props.handleSubmit}>Continue</Button>
                </div>
            </Segment>
        </div>
    )
}


