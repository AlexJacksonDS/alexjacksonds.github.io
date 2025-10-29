import { Col, Container, Row } from "react-bootstrap";
import { Player, Tile } from "@/types/scrabble";
import ScrabbleTile from "../Tile/Tile";
import { DropResult } from "@/types/railRoadInk";

export default function ScrabblePlayer(props: {
  player: Player;
  isTurn: boolean;
  handleTileMove: (dropResult: DropResult, item: { tile: Tile }) => void;
}) {
  return (
    <Container className="player-tiles">
      <Row>
        <Col className={`text-center${props.isTurn ? " text-success" : ""}`}>
          {props.isTurn ? "It's your turn" : "Waiting for other players..."}
        </Col>
      </Row>
      <Row className="player-tiles">
        {props.player.hand
          ? props.player.hand.map((tile, index) => (
              <Col key={index} className={`center g-0`}>
                <ScrabbleTile {...{ value: tile, isDraggable: true, handleTileMove: props.handleTileMove }} />
              </Col>
            ))
          : null}
      </Row>
    </Container>
  );
}
