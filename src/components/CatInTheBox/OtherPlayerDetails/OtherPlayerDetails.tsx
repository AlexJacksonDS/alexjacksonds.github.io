import { OtherPlayerDetails } from "@/types/catInTheBox";
import { Row, Col } from "react-bootstrap";
import "./OtherPlayerDetails.scss";

export default function OtherPlayerDetailsDisplay({ playerDetails }: { playerDetails: OtherPlayerDetails }) {
  return (
    <div className={"mt-2 other-player-container colour-" + playerDetails.playerColour}>
      <Row>
        <Col xs={3}>
          {playerDetails.selectedCard ? (
            <div className={"hand-card card-colour-" + playerDetails.selectedCard.colour}>
              {playerDetails.selectedCard.card}
            </div>
          ) : (
            <div className="hand-card"></div>
          )}
        </Col>
        <Col>
          <Row className="g-0">
            <Col className={"detail-col colour-" + playerDetails.playerColour}>{playerDetails.player.name}</Col>
            <Col className="detail-col">Cards: {playerDetails.handCount}</Col>
          </Row>
          <Row className="g-0">
            <Col className="detail-col">Bet: {playerDetails.betTrickCount}</Col>
            <Col className="detail-col">Taken: {playerDetails.trickCount}</Col>
          </Row>
          <Row className="g-0">
            <Col>Score: {playerDetails.score}</Col>
          </Row>
          <Row className="g-0">
            <Col className="has-colour-col">
              <div className={`has-colour red${playerDetails.hasRed ? "" : " no"}`}></div>
            </Col>
            <Col className="has-colour-col">
              <div className={`has-colour blue${playerDetails.hasBlue ? "" : " no"}`}></div>
            </Col>
            <Col className="has-colour-col">
              <div className={`has-colour yellow${playerDetails.hasYellow ? "" : " no"}`}></div>
            </Col>
            <Col className="has-colour-col">
              <div className={`has-colour green${playerDetails.hasGreen ? "" : " no"}`}></div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
