import { PlayerScore } from "@/types/hearts";
import { Col, Container, Row } from "react-bootstrap";
import "./ScoreBoard.scss";
import { Fragment } from "react";

export default function ScoreBoard(props: { scores: PlayerScore[] }) {
  return (
    <Container className="border scoreboard">
      <Row md={4} xs={2}>
        {props.scores.map((e, i) => {
          return (
            <Fragment key={`${i}${e.name}${i}${e.score}`}>
              <Col key={`${i}${e.name}`} className="border">{e.name}</Col>
              <Col key={`${i}${e.score}`} className="border">{e.score}</Col>
            </Fragment>
          );
        })}
      </Row>
    </Container>
  );
}
