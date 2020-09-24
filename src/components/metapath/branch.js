import React, { Component } from 'react';
import { Button, Icon, Dropdown, Input, Checkbox, Popup } from 'semantic-ui-react';

class Branch extends Component {

    // states here are to handle the filter dropdown menu
    constructor(props) {
        super(props);
        this.state = {
            filterOpen: false,
            filterBuffer: {}, // to store selected changing filter values before clicking 'add' button
            selectedFilter: '',
            selectedLoc: '', // index of location of filter
            selectedCount: '', // index of selected count
            label: []
        }
        this.myRef = React.createRef(); // to handle custom count input
        this.handleFilterClick = this.handleFilterClick.bind(this);
        this.handleFilterSelect = this.handleFilterSelect.bind(this);
        this.handleCountSelect = this.handleCountSelect.bind(this);
        this.handleLocSelect = this.handleLocSelect.bind(this);
        this.handleFilterClose = this.handleFilterClose.bind(this);
        this.handleTogglePred = this.handleTogglePred.bind(this);
    }

    // function to keep filter dropdown open when clicking options -- semantic-ui just closes the filter
    handleFilterClick(e) {
        e.preventDefault();
        this.setState({
            filterOpen: true
        })
    }
    
    // function to reset states when the filter is closed
    handleFilterClose(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.closeFilter(e);
        this.setState({
            filterOpen: false,
            filterBuffer: {},
            selectedFilter: '',
            selectedLoc: '',
            selectedCount: '',
            label: []
        })
    }

    // function to handle which filter is selected, adds to filter buffer
    handleFilterSelect(e, value) {
        e.preventDefault();
        var tempBuffer = this.state.filterBuffer;
        tempBuffer['name'] = value;
        this.setState({
            filterBuffer: tempBuffer,
            selectedFilter: value,
            label: []
        });
    }

    // function to add/remove predicate checkboxes -- predicates only shown for EdgeLabel filter selection
    handleTogglePred(e, pred) {
        e.preventDefault();
        var tempLabel = this.state.label;
        if (tempLabel.includes(pred)) {
            var index = tempLabel.indexOf(pred);
            tempLabel.splice(index, 1);
            this.setState({ label: tempLabel })
        } else {
            tempLabel.push(pred);
            this.setState({ label: tempLabel })
        }
    }

    // function to handle which count is selected
    handleCountSelect(e, value) {
        e.preventDefault();
        const counts = [25,50,100,0];
        var tempBuffer = this.state.filterBuffer;
        tempBuffer['count'] = counts[value];
        this.setState({
            filterBuffer: tempBuffer,
            selectedCount: value
        });
    }

    // functiion to handle the custom count input changes
    handleInputChange(e,input) {
        e.preventDefault();
        var value = parseInt(input.value)
        var tempBuffer = this.state.filterBuffer;
        tempBuffer['count'] = value;
        this.setState({
            filterBuffer: tempBuffer
        });
    }

    // function to handle selection of the location of the filter 
    handleLocSelect(e, value) {
        e.preventDefault();
        var tempBuffer = this.state.filterBuffer;
        tempBuffer['loc'] = value;
        this.setState({
            filterBuffer: tempBuffer,
            selectedLoc: value,
            label: []
        });
    }

    // drawing the metapath of the branch
    drawPath() {
        const inters = this.props.branch.path.map((node,index) => {
            let content='Filter: '+ this.props.branch.filters[index].name + ' Count: '+this.props.branch.filters[index].count;
            if ('label' in this.props.branch.filters[index]) {
                content += ' Label(s): ' + this.props.branch.filters[index].label;
            }
            return (
                <span>
                    <Popup  // to show selected filter for that stage in the path
                            content={content}
                            on='hover'
                            trigger={<Icon name="arrow alternate circle right outline"></Icon>}
                            position='bottom center'
                            size='mini'
                            disabled={!('name' in this.props.branch.filters[index])}
                    />
                    { node } {" "}
                </span>    
            );
        });
        
        return (<div>   {this.props.branch.source.name} {" "}
                        { inters }
                </div>
        );
    }

    render() {

        // filter options for filter dropdown
        const filters = ['NodeDegree', 'CoOccurrence', 'UniqueAPIs', 'EdgeLabel (predicate)']
        const filterOptions = filters.map(filter => 
            <Dropdown.Item>
                <Checkbox   radio 
                            label={filter} 
                            className='dropdownOptions' 
                            onChange={(e) => this.handleFilterSelect(e,filter)}
                            checked={this.state.selectedFilter === filter}/> 
            </Dropdown.Item>    
        );

        // get predicate options for edgelabel filter, display them only when selected
        var predOptions = [];
        if (this.props.branch.predicates.length > 0){
            for (let idx = 0; idx < this.props.branch.predicates.length; idx++){
                predOptions.push(this.props.branch.predicates[idx].map(pred => 
                    <Dropdown.Item className={this.state.selectedFilter === 'EdgeLabel (predicate)' && this.state.selectedLoc === idx? 'predBox' : 'hidden1'}>
                        <Checkbox   label={pred} 
                                    className='predOptions'
                                    onChange={(e) => this.handleTogglePred(e,pred)}
                                    checked={this.state.label.includes(pred)}
                        />
                    </Dropdown.Item>    
                ));
            }
        }
        const predCheck = predOptions.length === 0 && this.state.selectedFilter === 'EdgeLabel (predicate)';

        // where filters can be applied (intermediates or target)
        const locOptions = this.props.branch.path.map((inter,index) => {
            return(
                <Dropdown.Item>
                    <Checkbox   radio 
                                label={inter+' (node'+ (index+1) +')'} 
                                className='dropdownOptions'
                                onChange={(e) => this.handleLocSelect(e,index)}
                                checked={this.state.selectedLoc === index}/> 
                </Dropdown.Item>    
            );
        });

        // counts to be displayed for filter dropdown
        const countOptions = [25,50,100].map((count,index) => 
            <Dropdown.Item>
                <Checkbox   radio 
                            label={count} 
                            className='dropdownOptions'
                            onChange={(e) => this.handleCountSelect(e,index)}
                            checked={this.state.selectedCount === index}/> 
            </Dropdown.Item>    
        );

        // options for add node dropdown, get from availablePaths
        const interOptions = this.props.branch.availablePaths.map(node => 
            <Dropdown.Item  onClick={(e) => this.props.addNode(e,this.props.branch,node)}
                            text={node}
                            className='dropdownOptions'
            />
        );

        // message for add node dropdown
        const addAnother = this.props.branch.path.length === 0 ? '+ NODE' : '+ ANOTHER NODE';

        return (
            <div className={"Branch" + this.props.branch.id}>
                <div className="branch"> Path #{this.props.branch.id}: </div>

                <Dropdown // dropdown for adding a node
                    placeholder={addAnother}
                    selection
                    options={interOptions}
                    className='addInter'
                    upward={false}
                    disabled={this.props.branch.path.length === 3}
                />

                <Dropdown  // filter dropdown
                    placeholder='+ FILTER'
                    selection
                    upward={false}
                    className='addFilter'
                    onClick={this.handleFilterClick}
                    open={this.state.filterOpen} >
                    <Dropdown.Menu>
                        <Button size='mini'
                                color='purple'
                                inverted
                                fluid
                                onClick={this.handleFilterClose} 
                        // buttton to close dropdown... onBlur didn't work for semantic-ui
                        >
                            Close Dropdown 
                        </Button>
                        <Dropdown.Header className='filterHeader'>Where?</Dropdown.Header>
                            {locOptions}
                        <Dropdown.Divider className='filterDiv'/>
                        <Dropdown.Header className='filterHeader'>Choose Filter:</Dropdown.Header>
                            {filterOptions}
                            {predOptions}
                        <Dropdown.Item className={this.state.selectedLoc === '' && this.state.selectedFilter === 'EdgeLabel (predicate)' ? 'dropdownOptions' : 'hidden1'}>
                            <div className='error'><Icon name='x' size='large' color='red'/> ERROR: </div>
                            Please choose a location before selecting this filter.
                        </Dropdown.Item>
                        <Dropdown.Item className={predCheck ? 'dropdownOptions' : 'hidden1'}>
                            <div className='error'><Icon name='x' size='large' color='red'/> ERROR: </div>
                            No predicates found. Please select a different filter.
                        </Dropdown.Item>
                        <Dropdown.Divider className='filterDiv'/>
                        <Dropdown.Header className='filterHeader'>Count: </Dropdown.Header>
                            {countOptions}
                        <Dropdown.Item >
                            <Checkbox
                                radio
                                className='dropdownOptions'
                                checked={this.state.selectedCount === 3}
                                onChange={(e) => this.handleCountSelect(e,3)}
                                />
                            <Input // custom countt input
                                placeholder='Custom' 
                                size='mini' 
                                type='number'
                                ref={input => this.myRef = input} 
                                className='countInput'
                                onChange={this.handleInputChange.bind(this)}
                                focus={this.state.selectedCount === 3}
                                disabled={this.state.selectedCount !== 3}
                                />
                        </Dropdown.Item>
                        <Dropdown.Divider className='filterDiv'/>
                        {/* Error messages */}
                        <Dropdown.Item className={this.props.filterError ? 'dropdownOptions' : 'hidden1'}>
                            <div className='error'><Icon name='x' size='large' color='red'/> ERROR: </div>
                            Please select one option from each category.
                        </Dropdown.Item>
                        <Dropdown.Item className={this.props.filterPredError ? 'dropdownOptions' : 'hidden1'}>
                            <div className='error'><Icon name='x' size='large' color='red'/> ERROR: </div>
                            You must select at least one predicate for the EdgeLabel filter.
                        </Dropdown.Item>
                        <Dropdown.Item className={this.props.filterCountError ? 'dropdownOptions' : 'hidden1'}>
                            <div className='error'><Icon name='x' size='large' color='red'/> ERROR: </div>
                            Please enter a valid integer for the count.
                        </Dropdown.Item>
                        {/* success message after filter is applied */}
                        <Dropdown.Item className={this.props.filterSuccess ? 'dropdownOptions' : 'hidden1'}>
                            <div className='success'><Icon name='checkmark' size='large' color='green'/> SUCCESS: </div>
                            You may view your added filter by hovering over the arrow.
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Button size='mini'
                                    color='purple'
                                    inverted
                                    fluid
                                    onClick={(e) => this.props.addFilter(e,this.props.branch,this.state.filterBuffer,this.state.label)}
                                    className={this.props.filterSuccess ? 'hidden1' : ''}
                                    disabled={this.props.filterSuccess || predCheck ? true : false}>
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

                {/* Path for that branch */}
                <p className="nodes">{ this.drawPath() }</p>

                {/* remove branch button */}
                <Button className="removeBranch"
                        size='mini'
                        color='red'
                        compact
                        onClick={(e) => this.props.removeBranch(e,this.props.branch)}
                        disabled={this.props.disableRemove}>
                    Remove
                </Button>
            </div>
        );
    }
}

export default Branch;