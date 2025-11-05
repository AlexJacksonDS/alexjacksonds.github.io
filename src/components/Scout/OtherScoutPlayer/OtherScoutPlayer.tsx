import { Col, Container, Row } from "react-bootstrap";
import "./OtherScoutPlayer.scss";
import { OtherScoutGamePlayer } from "@/types/scout";
import PlayingCard from "@/components/PlayingCard/PlayingCard";

export default function OtherScoutPlayer(props: {
  player: OtherScoutGamePlayer;
  isTurn: boolean;
}) {
  return (
    <Container>
      <Row>
        <Col className={`text-center${props.isTurn ? " text-success" : ""}`}>
          {props.player.name ?? ""}
        </Col>
      </Row>
      <HorizontalCardsDisplay cardCount={props.player.handCount} />
    </Container>
  );
}

function HorizontalCardsDisplay(props: { cardCount: number }) {
  return (
    <Row className="card-display-container">
      {Array(props.cardCount)
        .fill("BLUE_BACK")
        .map((card, index) => (
          <Col
            key={index}
            className={`card-display g-0${index > 0 ? " stack" : ""}`}
          >
            <PlayingCard cardValue={card} onClick={() => {}} />
          </Col>
        ))}
    </Row>
  );
}
