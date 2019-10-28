import React from 'react';
import { Row, Col, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

function RenderCard(img, name, description) {
    return(
        <Card>
            <CardImg src={img} alt={name} />
            <CardBody>
                <CardTitle>{name}</CardTitle>
                <CardText>{description}</CardText>
            </CardBody>
        </Card>
    );  
}

function Home(props) {
    return(
        <div className="container">
            <div className="row">
                <Row>
                    <Col sm="6" md="3">
                      <Card body outline color="secondary" className="text-center">
                        <CardImg top src="/assets/single_hop_query.png" alt="Single Hop Query" />
                        <CardBody>
                          <CardTitle>Identifier lookup</CardTitle>
                          <CardText>Find identifiers</CardText>
                          <Button>Try it out!</Button>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col sm="6" md="3">
                      <Card body outline color="primary" className="text-center">
                        <CardImg top src="/assets/single_hop_query.png" alt="Single Hop Query" />
                        <CardBody>
                          <CardTitle>Single Hop Query</CardTitle>
                          <CardText>Query bio-entities directly linked to user specified input.</CardText>
                          <Button>Try it out!</Button>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col sm="6" md="3">
                      <Card body outline color="success" className="text-center">
                        <CardImg top src="/assets/multi_hop_query.png" alt="Multi Hop Query" />
                        <CardBody>
                          <CardTitle>Multi Hop Query</CardTitle>
                          <CardSubtitle>Card subtitle</CardSubtitle>
                          <CardText>Query bio-entities indirectly linked to user specified input through intermediate nodes.</CardText>
                          <Button>Try it out!</Button>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col sm="6" md="3">
                      <Card body outline color="info" className="text-center">
                        <CardImg top src="/assets/connect.png" alt="Connect" />
                        <CardBody>
                          <CardTitle>Connect</CardTitle>
                          <CardText>Find intermediate bio-entities which connects to both the user-specified input and output.</CardText>
                          <Button>Try it out!</Button>
                        </CardBody>
                      </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );

}

export default Home;