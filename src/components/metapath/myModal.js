import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import Graph from './graph';

class MyModal extends Component {
    
    render() {
        return (
            <Modal
                closeIcon
                open={this.props.modalOpen}
                onClose={this.props.handleClose}
            >
                <Modal.Header>Graph</Modal.Header>
                <Modal.Content>
                    <Graph 
                        branches={this.props.branches} 
                        source={this.props.source} 
                        output={this.props.output}
                    />
                </Modal.Content>
            </Modal>
        )
    }
}

export default MyModal;