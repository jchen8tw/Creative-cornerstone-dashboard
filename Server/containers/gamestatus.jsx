import React from "react";
import { ListGroup, ListGroupItem, Container, Row, Col } from "reactstrap";
import Countdown from './countdown';
export default (props) => {
  return (
    <Container fluid>
      <div style={{margin: "1em 0em"}}>
        <ListGroup>
          <ListGroupItem>
            <h2>Current Team:</h2>
          </ListGroupItem>
          <ListGroupItem>Team 1</ListGroupItem>
        </ListGroup>
      </div>
      <div style={{margin: "1em 0em"}}>
        <ListGroup>
          <Countdown/>
        </ListGroup>
      </div>
      <div style={{margin: "1em 0em"}}>
        <ListGroup>
          <ListGroupItem>
            <h2>Status</h2>
          </ListGroupItem>
          <ListGroupItem>
            Gamemode: game1
          </ListGroupItem>
          <ListGroupItem>
            points: 1000
          </ListGroupItem>
        </ListGroup>
      </div>
    </Container>
  );
};
