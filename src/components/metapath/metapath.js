import React from 'react';
import Graph from './graph';
import Path from './path';
import ModalSection from './modalSection';
import { Divider } from 'semantic-ui-react';

function Metapath(props) {

    return (
        <div className="stackable ui grid">
            <div className="row">
                <div className="ten wide column">
                    <Path   addBranch={props.addBranch} 
                            branches={props.branches} 
                            addInter={props.addInter} 
                            branchCheck={props.branchCheck}
                            removeBranch={props.removeBranch}/>
                    <div className={["mobile only", "toggleGraph"].join(' ')}> 
                        <ModalSection branches={props.branches} source={props.source.name} output={props.output}/>
                    </div>
                </div>
                <div className="divider">
                    <Divider vertical/>
                </div>
                <div className="six wide column mobile hidden">
                    <Graph branches={props.branches} source={props.source} output={props.output}/>
                </div>

            </div>
        </div>
    )
    
}

export default Metapath;