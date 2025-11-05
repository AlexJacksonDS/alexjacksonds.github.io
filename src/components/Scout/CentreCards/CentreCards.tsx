import { Col, Container, Row } from "react-bootstrap";
import Card from "../Card/ScoutCard";
import { ScoutCard } from "@/types/scout";

export default function CentreCards(props: {
  cards: ScoutCard[];
  cardsToHighlight: number[];
  player: string;
  selectScoutCard: (card: ScoutCard, index: number) => void;
}) {
  return (
    <Container>
      <Row>
        <Col className={`text-center`}>{props.player}</Col>
      </Row>
      <Row className="card-display-container">
        {props.cards
          ? props.cards.map((card, index) => (
              <Col
                key={index}
                className={`card-display g-0${
                  props.cardsToHighlight.includes(index) ? " highlighted" : ""
                }`}
                onClick={() => props.selectScoutCard(card, index)}
              >
                <Card card={card} />
              </Col>
            ))
          : null}
      </Row>
    </Container>
  );
}
