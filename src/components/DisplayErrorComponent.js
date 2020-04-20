import React from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

const ErrorMessage = (props) => <Modal
        open={props.modalOpen}
        handleClose={props.handleClose}
        basic
        size='small'
      >
        <Modal.Header>User Input Error</Modal.Header>
        <Modal.Content>
          <h3>You haven't selected the {props.field} yet.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={props.handleClose} inverted>
            <Icon name='checkmark' /> Got it
          </Button>
        </Modal.Actions>
      </Modal>

export default ErrorMessage
