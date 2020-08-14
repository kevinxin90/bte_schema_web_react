import React from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

const BranchErrorMessage = (props) => <Modal
        open={props.modalOpen}
        handleClose={props.handleClose}
        basic
        size='small'
      >
        <Modal.Header>User Input Error</Modal.Header>
        <Modal.Content>
          <h3>Two or more of your branches are the same. Please make sure all branches are unique before continuing.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={props.handleClose} inverted>
            <Icon name='checkmark' /> Got it
          </Button>
        </Modal.Actions>
      </Modal>

export default BranchErrorMessage;
