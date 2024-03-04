import { Col, Container, Row } from "react-bootstrap";
import PlayingCard from "../PlayingCard/PlayingCard";
import { OtherPlayer } from "@/types/hearts";
import "./OtherCardPlayer.scss";

export default function OtherCardPlayer(props: {
  player: OtherPlayer;
  isTurn: boolean;
  rotateCards: boolean;
  isLeft: boolean;
}) {
  return (
    <Container>
      <Row>
        <Col className={`text-center${props.isTurn ? " text-success" : ""}`}>{props.player.name ?? ""}</Col>
      </Row>
      {props.rotateCards ? (
        <VerticalCardsDisplay cardCount={props.player.handCount} isLeft={props.isLeft} />
      ) : (
        <HorizontalCardsDisplay cardCount={props.player.handCount} />
      )}
    </Container>
  );
}

function HorizontalCardsDisplay(props: { cardCount: number }) {
  return (
    <Row className="card-display-container">
      {Array(props.cardCount)
        .fill("BLUE_BACK")
        .map((card, index) => (
          <Col key={index} className={`card-display g-0${index > 0 ? " stack" : ""}`}>
            <PlayingCard cardValue={card} onClick={() => {}} />
          </Col>
        ))}
    </Row>
  );
}

function VerticalCardsDisplay(props: { cardCount: number; isLeft: boolean }) {
  function shouldStack(index: number) {
    return (index > 0 && props.isLeft) || (index < props.cardCount - 1 && !props.isLeft);
  }

  function getZIndex(index: number) {
    return props.isLeft ? props.cardCount - index : index;
  }

  return Array(props.cardCount)
    .fill("BLUE_BACK_ROTATE")
    .map((card, index) => (
      <Row key={index}
        style={{ zIndex: getZIndex(index) }}
        className={`card-display-side${shouldStack(index) ? " stack" : ""}${props.isLeft ? " top" : " bottom"}`}
      >
        <Col className={`card-display-col${props.isLeft ? " left" : " right"}`}>
          <PlayingCard cardValue={card} onClick={() => {}} />
        </Col>
      </Row>
    ));
}
