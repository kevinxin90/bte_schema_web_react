import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import MyModal from './myModal';

class ModalSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        }
    }

    render() {
        return ([
            <Button
                key="button"
                content="Click to view graph"
                onClick={() => {
                    this.setState({ modalOpen: true })
                }}
            />,
            <MyModal
                key="modal"
                modalOpen={this.state.modalOpen}
                handleClose={() => {
                    this.setState({ modalOpen: false })
                }}
                branches={this.props.branches} 
                source={this.props.source} 
                output={this.props.output}
                className="myModal"
            />
        ])
    }
}

export default ModalSection;