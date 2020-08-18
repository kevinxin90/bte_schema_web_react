import React from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

const BranchErrorMessage = (props) => <Modal
        open={props.modalOpen}
        handleClose={props.handleClose}
        basic
        size='small'
      >
        <Modal.Header>Branch Warning</Modal.Header>
        <Modal.Content>
          <h3>Two or more of your branches are the same. These will be treated as the same branch in the query process. Would you like to continue?</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={props.handleClose} inverted>
             Stay on Metapath 
          </Button>
          <Button color='green' onClick={props.handleContinue} inverted>
             Continue
             <Icon name='angle right' />
          </Button>
        </Modal.Actions>
      </Modal>

export default BranchErrorMessage;
