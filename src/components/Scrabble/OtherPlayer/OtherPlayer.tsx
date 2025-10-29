import { Container, Row } from "react-bootstrap";
import { OtherPlayer } from "@/types/scrabble";

export default function ScrabbleOtherPlayer(props: { player: OtherPlayer }) {
  return (
    <Container>
      <Row className="card-display-container">
        {props.player.tileCount
          ? (<div>{props.player.tileCount} tiles</div>)
          : null}
      </Row>
    </Container>
  );
}
