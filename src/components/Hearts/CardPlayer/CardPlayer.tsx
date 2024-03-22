import { Col, Container, Row } from "react-bootstrap";
import PlayingCard from "../../PlayingCard/PlayingCard";
import "./CardPlayer.scss";
import { Player } from "@/types/hearts";

export default function CardPlayer(props: { player: Player; cardsToHighlight: string[]; isTurn: boolean; selectCard: any }) {
  return (
    <Container>
      <Row>
        <Col className={`text-center${props.isTurn ? " text-success" : ""}`}>
          {props.isTurn ? "It's your turn" : "Waiting for other players..."}
        </Col>
      </Row>
      <Row className="card-display-container">
        {props.player.hand
          ? props.player.hand.map((card, index) => (
              <Col key={index} className={`card-display g-0${props.cardsToHighlight.includes(card) ? " highlighted": ""}`}>
                <PlayingCard cardValue={card} onClick={() => props.selectCard(card)} />
              </Col>
            ))
          : null}
      </Row>
    </Container>
  );
}
