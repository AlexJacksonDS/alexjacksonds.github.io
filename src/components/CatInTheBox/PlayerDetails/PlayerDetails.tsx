import { MyDetails } from "@/types/catInTheBox";
import { Row, Col } from "react-bootstrap";
import "./PlayerDetails.scss";
import Cards from "../Cards/Cards";

export default function PlayerDetails({ playerDetails, handleClick }: { playerDetails: MyDetails, handleClick: any }) {
  return (
    <div className={"player-container colour-" + playerDetails.playerColour}>
      <Row className="g-0">
        <Col className={"detail-col colour-" + playerDetails.playerColour}>{playerDetails.player.name}</Col>
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
      <Row>
        <Cards cards={playerDetails.currentHand} handleClick={handleClick}/>
      </Row>
    </div>
  );
}
