import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, List } from 'semantic-ui-react';
import './Footer.css';

function Footer(props) {
    return(
        <Grid style={{backgroundColor: '#9f7de8', padding: '0 5vw', paddingTop: '1rem'}} textAlign='center' centered columns={3} stackable>
            <Grid.Column centered textAlign='left'>
                <h5>Biothings Explorer</h5>
                <p>© Copyright 2017-{new Date().getFullYear()} The Su/Wu Lab.</p>
            </Grid.Column>
            <Grid.Column centered textAlign='left'>
                <h5>Links</h5>
                <List>
                    <List.Item><Link to='/' className="footer-link">HOME</Link></List.Item>
                    <List.Item><Link to='/predict' className="footer-link">PREDICT</Link></List.Item>
                    <List.Item><Link to='/explain' className="footer-link">EXPLAIN</Link></List.Item>
                </List>
            </Grid.Column>
            <Grid.Column centered textAlign='left'>
                <h5>Contact Us</h5>
                <p><i className="fa fa-envelope fa-lg"></i> : <a href="mailto:biothings@googlegroups.com" className="footer-link">biothings@googlegroups.com</a></p>
                
                    
            </Grid.Column>
        </Grid>
    // <div className="footer">
    //     <div className="container">
    //         <div className="row justify-content-center">
    //             <div className="col-4 offset-1 col-sm-5">
    //                 <h5>Links</h5>
    //                 <ul className="list-unstyled">
    //                     <li><Link to='/predict'>PREDICT</Link></li>
    //                     <li><Link to='/explain'>EXPLAIN</Link></li>
    //                 </ul>
    //             </div>
    //             <div className="col-7 col-sm-5">
    //                 <h5>Contact Us</h5>
    //                   <i className="fa fa-envelope fa-lg"></i>: <a href="mailto:biothings@googlegroups.com">
    //                      biothings@googlegroups.com</a>
    //             </div>
    //             <div className="col-12 col-sm-4 align-self-center">
    //                 <div className="text-center">
    //                     <a className="btn btn-social-icon btn-twitter" href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fbiothings.io%2F&ref_src=twsrc%5Etfw&region=follow_link&screen_name=biothingsapi&tw_p=followbutton"><i className="fa fa-twitter"></i></a>
    //                     <a className="btn btn-social-icon" href="mailto:mailto:biothings@googlegroups.com"><i className="fa fa-envelope-o"></i></a>
    //                 </div>
    //             </div>
    //         </div>
    //         <div className="row justify-content-center">
    //             <div className="col-auto">
    //                 
    //             </div>
    //         </div>
    //     </div>
    // </div>
    )
}

export default Footer;