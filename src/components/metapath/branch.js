import React, { Component } from 'react';
import { Button, Icon, Dropdown, Input, Checkbox, Popup } from 'semantic-ui-react';

class Branch extends Component {

    // states here are to handle the filter dropdown menu
    constructor(props) {
        super(props);
        this.state = {
            filterOpen: false,
            filterBuffer: {},
            selectedFilter: '',
            selectedLoc: '',
            selectedCount: ''
        }
        this.handleFilterClick = this.handleFilterClick.bind(this);
        this.handleFilterSelect = this.handleFilterSelect.bind(this);
        this.handleCountSelect = this.handleCountSelect.bind(this);
        this.handleLocSelect = this.handleLocSelect.bind(this);
        this.handleFilterClose = this.handleFilterClose.bind(this);
    }

    handleFilterClick(e) {
        e.preventDefault();
        this.setState({
            filterOpen: true
        })
    }
    
    handleFilterClose(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.closeFilter(e);
        this.setState({
            filterOpen: false,
            filterBuffer: {},
            selectedFilter: '',
            selectedLoc: '',
            selectedCount: ''
        })
    }

    handleFilterSelect(e, value) {
        e.preventDefault();
        var tempBuffer = this.state.filterBuffer;
        tempBuffer['name'] = value;
        this.setState({
            filterBuffer: tempBuffer,
            selectedFilter: value
        });
    }

    handleCountSelect(e, value) {
        e.preventDefault();
        var tempBuffer = this.state.filterBuffer;
        tempBuffer['count'] = value;
        this.setState({
            filterBuffer: tempBuffer,
            selectedCount: value
        });
    }

    handleLocSelect(e, value) {
        e.preventDefault();
        var tempBuffer = this.state.filterBuffer;
        tempBuffer['loc'] = value;
        this.setState({
            filterBuffer: tempBuffer,
            selectedLoc: value
        });
    }

    // add popups in arrows for filters?
    drawPath() {
        const inters = this.props.branch.intermediates.map((node,index) => 
            <span>
                <Popup  content={'Filter: '+ this.props.branch.filters[index].name + ' Count: '+this.props.branch.filters[index].count}
                        on='hover'
                        trigger={<Icon name="arrow alternate circle right outline"></Icon>}
                        position='bottom center'
                        size='mini'
                        disabled={!('name' in this.props.branch.filters[index])}
                />
                { node } {" "}
            </span>    
        );
        return (<div>   {this.props.branch.source.name} {" "}
                        { inters }
                        <Popup  content={'Filter: '+ this.props.branch.filters[inters.length].name + ' Count: '+this.props.branch.filters[inters.length].count}
                                on='hover'
                                trigger={<Icon name="arrow alternate circle right outline"></Icon>}
                                position='bottom center'
                                size='mini'
                                disabled={!('name' in this.props.branch.filters[inters.length])}
                        />  
                        {this.props.branch.output}
                </div>
        );
    }

    render() {
        const filters = ['NodeDegree', 'EdgeLabel (predicate)', 'CoOccurrence', 'UniqueAPIs']
        const filterOptions = filters.map(filter => 
            <Dropdown.Item>
                <Checkbox   radio 
                            label={filter} 
                            className='dropdownOptions' 
                            onChange={(e) => this.handleFilterSelect(e,filter)}
                            checked={this.state.selectedFilter === filter}/> 
            </Dropdown.Item>    
        );

        // where filters can be applied (intermediates or target)
        const locOptions = this.props.branch.intermediates.map((inter,index) => {
            let label = inter+' (inter'+ (index+1) +')';
            return(
                <Dropdown.Item>
                    <Checkbox   radio 
                                label={label} 
                                className='dropdownOptions'
                                onChange={(e) => this.handleLocSelect(e,index)}
                                checked={this.state.selectedLoc === index}/> 
                </Dropdown.Item>    
            );
        });
        let label = this.props.branch.output+' (target)';
        locOptions.push(<Dropdown.Item>
                            <Checkbox   radio 
                                        label={label} 
                                        className='dropdownOptions'
                                        onChange={(e) => this.handleLocSelect(e,this.props.branch.intermediates.length)}
                                        checked={this.state.selectedLoc === this.props.branch.intermediates.length}/> 
                        </Dropdown.Item>);

        const countOptions = [25,50,100].map(count => 
            <Dropdown.Item>
                <Checkbox   radio 
                            label={count} 
                            className='dropdownOptions'
                            onChange={(e) => this.handleCountSelect(e,count)}
                            checked={this.state.selectedCount === count}/> 
            </Dropdown.Item>    
        );

        const interOptions = this.props.branch.availableInters.map(node => 
            <Dropdown.Item  onClick={(e) => this.props.addInter(e,this.props.branch,node)}
                            text={node}
                            className='dropdownOptions'
            />
        );

        return (
            <div className={"Branch" + this.props.branch.id}>
                <div className="branch">Branch #{this.props.branch.id}:</div>

            <Dropdown
                placeholder='+ INTERMEDIATE NODE'
                selection
                options={interOptions}
                className='addInter'
                upward={false}
            />

            <Dropdown 
                placeholder='+ FILTER'
                selection
                upward={false}
                className='addFilter'
                onClick={this.handleFilterClick}
                open={this.state.filterOpen}
                onBlur={this.handleFilterClose}>
                <Dropdown.Menu>
                    <Dropdown.Header>Choose Filter:</Dropdown.Header>
                        {filterOptions}
                    <Dropdown.Divider className='filterDiv'/>
                    <Dropdown.Header>Where?</Dropdown.Header>
                        {locOptions}
                    <Dropdown.Divider className='filterDiv'/>
                    <Dropdown.Header>Count: </Dropdown.Header>
                        {countOptions}
                    {/*<Dropdown.Item >
                        <Checkbox
                            radio
                            label={<Input placeholder='Custom' size='mini'/>}
                        />
                    </Dropdown.Item>*/}
                    <Dropdown.Divider className='filterDiv'/>
                    <Dropdown.Item className={this.props.filterError ? 'dropdownOptions' : 'hidden1'}>
                        <div className='error'><Icon name='x' size='large' color='red'/> ERROR: </div>
                        Please select one option from each category.
                    </Dropdown.Item>
                    <Dropdown.Item className={this.props.filterSuccess ? 'dropdownOptions' : 'hidden1'}>
                        <div className='success'><Icon name='checkmark' size='large' color='green'/> SUCCESS: </div>
                        You may view your added filter by hovering over the arrow.
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <Button size='mini'
                                color='purple'
                                inverted
                                fluid
                                onClick={(e) => this.props.addFilter(e,this.props.branch,this.state.filterBuffer)}
                                className={this.props.filterSuccess ? 'hidden1' : ''}
                                disabled={this.props.filterSuccess ? true : false}>
                            ADD
                        </Button>
                        <Button size='mini'
                                color='purple'
                                inverted
                                fluid
                                onClick={this.handleFilterClose}
                                className={this.props.filterSuccess ? '' : 'hidden1'}
                                disabled={this.props.filterSuccess ? false : true}>
                            CLOSE
                        </Button>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>


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