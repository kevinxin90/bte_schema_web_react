import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Message } from 'semantic-ui-react';
import bte from '../assets/biothings-explorer-text.png';
import network from '../assets/network.png';
import { Menu, Grid, Image } from 'semantic-ui-react';

class Header extends Component {
    render() {
        return(
            <React.Fragment>
                <Menu color="violet" inverted style={{ borderRadius: 0 }}>
                    <Menu.Item>
                        <img src={bte} alt="BioThings Explorer" />
                    </Menu.Item>
                    <Menu.Item
                        name='HOME'
                        as={NavLink}
                        exact to='/'
                        >
                        HOME
                    </Menu.Item>

                    <Menu.Item
                        name='PREDICT'
                        as={NavLink}
                        exact to='/predict'
                        >
                        PREDICT
                    </Menu.Item>

                    <Menu.Item
                        name='EXPLAIN'
                        as={NavLink}
                        exact to='/explain'
                        >
                        EXPLAIN
                    </Menu.Item>
                </Menu>

                <Grid style={{'backgroundColor': '#9f7de8', marginBottom: '2rem'}} textAlign='center'>
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

            </React.Fragment>
        )
    }
}

export default Header;