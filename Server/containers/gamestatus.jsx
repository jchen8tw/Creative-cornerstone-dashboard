import React from "react";
import { ListGroup, ListGroupItem, Container, Row, Col } from "reactstrap";
import Countdown from "./countdown";
export default (props) => {
    const { time_remain, history, status, current_team } = props.game_info;
    //console.log(props);
    return (
        <Container fluid>
            <div style={{ margin: "1em 0em" }}>
                <ListGroup>
                    <ListGroupItem>
                        <h2>Current Team:</h2>
                    </ListGroupItem>
                    <ListGroupItem>{current_team}</ListGroupItem>
                </ListGroup>
            </div>
            <div style={{ margin: "1em 0em" }}>
                <ListGroup>
                    <Countdown time_remain={time_remain} />
                </ListGroup>
            </div>
            <div style={{ margin: "1em 0em" }}>
                <ListGroup>
                    <ListGroupItem>
                        <h2>Status</h2>
                    </ListGroupItem>
                    <ListGroupItem>
                        <h3>points: {status.point}</h3>
                    </ListGroupItem>
                    <ListGroupItem>
                        <h3>
                            {" "}
                            Gamemode:{" "}
                            {status.gamemode == 0
                                ? "game1"
                                : status.gamemode == 1
                                ? "game2"
                                : "unknown"}
                        </h3>
                    </ListGroupItem>
                </ListGroup>
            </div>
        </Container>
    );
};
