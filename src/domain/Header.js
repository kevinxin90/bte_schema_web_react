import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Message } from 'semantic-ui-react';
import bte from '../assets/biothings-explorer-text.png';
import network from '../assets/network.png';
import { Menu, Grid, Image } from 'semantic-ui-react';

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isNavOpen: false,
            isModalOpen: false
        };
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state
        return(
            <React.Fragment>
                <Menu color="violet" inverted style={{ borderRadius: 0 }}>
                    <Menu.Item>
                        <img src={bte} alt="BioThings Explorer" />
                    </Menu.Item>
                    <Menu.Item
                        name='HOME'
                        active={activeItem === 'HOME'}
                        onClick={this.handleItemClick}
                        >
                        <Link to='/'>HOME</Link>
                    </Menu.Item>

                    <Menu.Item
                        name='PREDICT'
                        active={activeItem === 'PREDICT'}
                        onClick={this.handleItemClick}
                        >
                        <Link to='/predict'>PREDICT</Link>
                    </Menu.Item>

                    <Menu.Item
                        name='EXPLAIN'
                        active={activeItem === 'EXPLAIN'}
                        onClick={this.handleItemClick}
                        >
                        <Link to='/explain'>EXPLAIN</Link>
                    </Menu.Item>
                </Menu>

                <Grid style={{'backgroundColor': '#9f7de8'}} textAlign='center'>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                        <Image src={network} />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                        <br></br>
                        <br></br>
                        <h1 style={{'color': '#e2e1e6'}}>BioThings Explorer</h1>
                        <br></br>
                        <h3 style={{'color': '#e2e1e6', 'fontSize': '1.5rem'}}>BioThings Explorer allows users to query a vast amount of biological and chemical databases in a central place by calling APIs which distribute these data on the fly. </h3>
                    </Grid.Column>
                </Grid>

                <Message warning>
                    <Message.Header>This web service is a simple demo for our <a href="https://github.com/biothings/biothings_explorer" target="_blank" rel="noopener noreferrer">Python Client</a>.</Message.Header>
                </Message>
            </React.Fragment>
        )
    }
}

export default Header;