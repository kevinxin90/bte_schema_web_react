import { Button, Form, Segment } from 'semantic-ui-react'
import React, { Component } from 'react';

class MetaPathForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPath: ''
        }
    }



    render() {
        const radios = this.props.paths.map((path) => {
            return (
                <Form.Field key={path} label={path} name={path} value={path} control='input' type='checkbox' onChange={this.props.handleSelect}/>
            );
          });

        return (
            <div className={this.props.shouldHide ? '' : 'hidden'}>
                <div className="row">
                    <div className="col-12">
                        <Segment color='red'>
                            <Form>
                                <h2> Step 2: Select the MetaPath you want to execute.</h2>
                                <hr />
                                <Form.Group grouped>
                                    <label>Metapaths</label>
                                    {radios}
                                </Form.Group>
                                <div className="col text-center">
                                    <Button type='submit' onClick={this.props.handleBackToStep1}>Back</Button>
                                    <Button type='submit' onClick={this.props.handleSubmit}>Continue</Button>
                                </div>
                            </Form>
                        </Segment>
                    </div>
                </div>
            </div>
        )
    }
}


export default MetaPathForm
