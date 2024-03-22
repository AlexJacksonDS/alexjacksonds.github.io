import { Col, Container, Row } from "react-bootstrap";
import PlayingCard from "../../PlayingCard/PlayingCard";
import "./PlayedCards.scss";

export default function PlayedCards(props: {
  playedCard: string;
  leftPlayed: string;
  topPlayed: string;
  rightPlayed?: string;
}) {
  return (
    <Container className="play-area flex-column">
      <Row className="play-row">
        <Col></Col>
        <Col className="played">
          {props.topPlayed ? <PlayingCard cardValue={props.topPlayed} onClick={() => {}} /> : null}
        </Col>
        <Col></Col>
      </Row>
      <Row className="play-row">
        <Col></Col>
        <Col className="played">
          {props.leftPlayed ? <PlayingCard cardValue={props.leftPlayed} onClick={() => {}} /> : null}
        </Col>
        <Col></Col>
        <Col className="played">
          {props.rightPlayed ? <PlayingCard cardValue={props.rightPlayed} onClick={() => {}} /> : null}
        </Col>
        <Col></Col>
      </Row>
      <Row className="play-row">
        <Col></Col>
        <Col className="played">
          {props.playedCard ? <PlayingCard cardValue={props.playedCard} onClick={() => {}} /> : null}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
