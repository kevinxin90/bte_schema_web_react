import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';

class Branch extends Component {

    drawPath() {
        const inters = this.props.branch.intermediates.map(node => 
            <span>
                { node } {" "}
                <Icon name="arrow alternate circle right outline"></Icon>
            </span>    
        )
        return (<div>   {this.props.branch.source.name} {" "}
                        <Icon name="arrow alternate circle right outline"></Icon>
                        { inters }
                        {this.props.branch.output}
                </div>);
    }

    render() {

        const options = this.props.branch.availableInters.map((node,index) => 
            <option value={index}>{node}</option>
        );
        const interMessage = this.props.branch.intermediates.length === 0 ? "+ INTERMEDIATE NODE 1" : "+ INTEMEDIATE NODE 2";

        return (
            <div className={"Branch" + this.props.branch.id}>
                <div className="branch">Branch #{this.props.branch.id}:</div>
                <select id={"intNodes"+this.props.branch.id} className={["ui dropdown", "addInter"].join(' ')}>
                    <option value="">{interMessage}</option>
                    {options}
                </select>
                <Button className="addInterButton" 
                        onClick={(e) => this.props.addInter(e,this.props.branch)}
                        size="mini">
                    ADD
                </Button>
                <p className="nodes">{ this.drawPath() }</p>
                <Button className="removeBranch"
                        size='mini'
                        color='red'
                        compact
                        onClick={(e) => this.props.removeBranch(e,this.props.branch)}>
                    Remove
                </Button>
            </div>
        );
    }
}

export default Branch;