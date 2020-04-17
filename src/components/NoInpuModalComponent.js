import React, { Component } from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

export default class ModalExampleControlled extends Component {

  render() {
    return (
      <Modal
        open={this.props.modalOpen}
        handleClose={this.props.handleClose}
        basic
        size='small'
      >
        <Modal.Header>User Input Error</Modal.Header>
        <Modal.Content>
          <h3>You haven't selected the {this.props.field} yet.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.props.handleClose} inverted>
            <Icon name='checkmark' /> Got it
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}