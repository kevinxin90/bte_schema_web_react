import React from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'

const BranchErrorMessage = (props) => {
      
      let message1 = "";
      let message2 = "";
      if (props.branchCheck[0].length !== 0) {
        message1 += "- Two or more of your branches are the same. These will be treated as the same branch in the query process.";
      }
      if (props.branchCheck[1].length !== 0) {
        message2 += "- One or more of your branches does not have a selected metapath. Those branch(es) will be automatically removed from the query process."; 
      }

      return (
        <Modal
          open={props.modalOpen}
          handleClose={props.handleClose}
          basic
          size='small'
        >
          <Modal.Header>Branch Warning</Modal.Header>
          <Modal.Content>
            <h3>
              {message1}
              <br/>
              {message2}
              <br/> <br/>
              Would you like to continue?
            </h3>
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
      )
}

export default BranchErrorMessage;
