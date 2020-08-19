import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Icon } from 'semantic-ui-react';
import './Footer.css';

function Footer(props) {
    return(
        <Grid style={{backgroundColor: '#9f7de8', padding: '1rem 5vw'}} textAlign='center' centered columns={3} stackable>
            <Grid.Column textAlign='left'>
                <h5>Biothings Explorer</h5>
                <p>© Copyright 2017-{new Date().getFullYear()} The Su/Wu Lab.</p>
            </Grid.Column>
            <Grid.Column textAlign='left'>
                <h5>Links</h5>
                <List>
                    <List.Item><Link to='/' className="footer-link">HOME</Link></List.Item>
                    <List.Item><Link to='/predict' className="footer-link">PREDICT</Link></List.Item>
                    <List.Item><Link to='/explain' className="footer-link">EXPLAIN</Link></List.Item>
                </List>
            </Grid.Column>
            <Grid.Column textAlign='left'>
                <h5>Contact Us</h5>
                <p><Icon name='mail' size='large' />: <a href="mailto:biothings@googlegroups.com" className="footer-link">biothings@googlegroups.com</a></p>
            </Grid.Column>
        </Grid>
    )
}

export default Footer;