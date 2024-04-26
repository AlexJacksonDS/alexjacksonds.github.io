import { ScoringCard } from "@/types/cartographers";
import { Col, Row } from "react-bootstrap";

export default function ScoreCards({
  a,
  b,
  c,
  d,
}: {
  a?: ScoringCard;
  b?: ScoringCard;
  c?: ScoringCard;
  d?: ScoringCard;
}) {
  return (
    <>
      <Row>
        <Col className="border"><h3>Spring: A & B</h3></Col>
        <Col className="border"><h3>Summer: B & C</h3></Col>
        <Col className="border"><h3>Autumn: C & D</h3></Col>
        <Col className="border"><h3>Winter: D & A</h3></Col>
      </Row>
      <Row>
        {a ? <ScoreCard card={a} letter="A" /> : null}
        {b ? <ScoreCard card={b} letter="B" /> : null}
        {c ? <ScoreCard card={c} letter="C" /> : null}
        {d ? <ScoreCard card={d} letter="D" /> : null}
      </Row>
    </>
  );
}

function ScoreCard({ card, letter }: { card: ScoringCard; letter: string }) {
  return (
    <Col className="border">
      <h4>
        {letter}: {card.title}
      </h4>
      <p>{card.scoringCriteria}</p>
    </Col>
  );
}
