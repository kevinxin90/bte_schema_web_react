import React from 'react'
import { Divider, Button, Card, Grid, Image, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import explain from './assets/bte-explain.png';
import predict from './assets/bte-predict.png';

const Home = () => (
  <div className="container">
  <Segment>
    <Grid columns={2} relaxed='very'>
      <Grid.Column>
        <Card centered href="/explorer/explain" color="red" className="homeCard">
          <Image src={explain} wrapped ui={false} />
          <Card.Content textAlign="center">
            <Card.Header>EXPLAIN</Card.Header>
            <Card.Description>
            EXPLAIN queries are designed to identify plausible reasoning chains to explain the relationship between two entities.
            </Card.Description>
          </Card.Content>
          <Card.Content extra textAlign="center">
            <Link to='/explain'><Button>Try it Out</Button></Link>
          </Card.Content>
        </Card>
      </Grid.Column>
      <Grid.Column>
        <Card centered href="/explorer/predict" color="green" className="homeCard">
          <Image src={predict} wrapped ui={false} />
          <Card.Content textAlign="center">
            <Card.Header>PREDICT</Card.Header>
            <Card.Description>
            PREDICT queries are designed to predict plausible relationships between one entity and an entity class, such as Gene.
            </Card.Description>
          </Card.Content>
          <Card.Content extra textAlign="center">
            <Link to='/predict'><Button>Try it Out</Button></Link>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>

    <Divider vertical>Or</Divider>
  </Segment>
  </div>
)

export default Home