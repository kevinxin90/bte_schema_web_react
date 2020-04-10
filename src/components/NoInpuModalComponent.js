import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

export default class ModalExampleControlled extends Component {

  render() {
    return (
      <Modal
        open={this.props.modalOpen}
        handleClose={this.props.handleClose}
        basic
        size='small'
      >
        <Header icon='browser' content='User Input Error' />
        <Modal.Content>
          <h3>You haven't selected the input/output yet.</h3>
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