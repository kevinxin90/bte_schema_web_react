import React from 'react';
import Graph from './graph';
import Path from './path';
import { Divider } from 'semantic-ui-react';

function Metapath(props) {

    return (
        <div className="stackable ui grid">
            <div className="row">
                <div className="ten wide column">
                    <Path   addBranch={props.addBranch} 
                            branches={props.branches} 
                            addNode={props.addNode} 
                            branchCheck={props.branchCheck}
                            removeBranch={props.removeBranch}
                            addFilter={props.addFilter}
                            filterSuccess={props.filterSuccess}
                            filterError={props.filterError}
                            closeFilter={props.closeFilter}
                            filterPredError={props.filterPredError}
                            filterCountError={props.filterCountError}
                            source={props.source}
                            //output={props.output}
                            />
                </div>
                <div className="metapathDivider">
                    <Divider vertical/>
                </div>
                <div className="six wide column mobile hidden tablet hidden">
                    <Graph branches={props.branches} source={props.source} /*output={props.output}*/ />
                </div>

            </div>
        </div>
    )
    
}

export default Metapath;