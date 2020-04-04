import React from 'react'
import { Divider, Grid, Image, Segment } from 'semantic-ui-react'
import { Row, Col, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="container">
  <Segment>
    <Grid columns={2} relaxed='very'>
      <Grid.Column>
        <Card body outline color="secondary" className="text-center">
            <CardImg bottom src="/assets/images/bte-explain.png" alt="Single Hop Query" className="cardImage"/>
            <CardBody>
                <CardTitle><h1>Explain</h1></CardTitle>
                <CardText>EXPLAIN queries are designed to identify plausible reasoning chains to explain the relationship between two entities.</CardText>
                <Link to="/explorer_kgs/explain"><Button>Try it Out</Button></Link>
            </CardBody>
        </Card>
      </Grid.Column>
      <Grid.Column>
      <Card body outline color="secondary" className="text-center">
            <CardImg bottom src="/assets/images/bte-predict.png" alt="Single Hop Query" className="cardImage"/>
            <CardBody>
                <CardTitle><h1>Predict</h1></CardTitle>
                <CardText>PREDICT queries are designed to predict plausible relationships between one entity and an entity class, such as Gene.</CardText>
                <Link to="/explorer_kgs/predict"><Button>Try it Out</Button></Link>
            </CardBody>
        </Card>
      </Grid.Column>
    </Grid>

    <Divider vertical>Or</Divider>
  </Segment>
  </div>
)

export default Home