import React from 'react'
import { Divider, Grid, Image, Segment } from 'semantic-ui-react'
import { Row, Col, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

const Home = () => (
  <Segment>
    <Grid columns={2} relaxed='very'>
      <Grid.Column>
        <Card body outline color="secondary" className="text-center">
            <CardImg bottom src="/assets/connect.png" alt="Single Hop Query" size="mini"/>
            <CardBody>
                <CardTitle>Explain</CardTitle>
                <CardText>Find identifiers</CardText>
                <Button>Try it out!</Button>
            </CardBody>
        </Card>
      </Grid.Column>
      <Grid.Column>
        
      </Grid.Column>
    </Grid>

    <Divider vertical>Or</Divider>
  </Segment>
)

export default Home