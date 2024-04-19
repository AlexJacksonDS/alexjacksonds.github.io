import { Col, Container, Row } from "react-bootstrap";
import "./Cards.scss";

export default function Cards({ cards, handleClick }: { cards: number[]; handleClick: any }) {
  return (
    <Container>
      <Row>
        {cards
          .sort((a, b) => a - b)
          .map((c, i) => (
            <Col className="card-col" key={i}>
              <div className="hand-card" onClick={() => handleClick(c)}>
                {c}
              </div>
            </Col>
          ))}
      </Row>
    </Container>
  );
}
