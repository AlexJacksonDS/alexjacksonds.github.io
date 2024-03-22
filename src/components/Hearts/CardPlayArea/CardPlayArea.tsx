import { Col, Container, Row } from "react-bootstrap";
import { OtherPlayer, Player } from "../../../types/hearts";
import OtherCardPlayer from "../OtherCardPlayer/OtherCardPlayer";
import CardPlayer from "../CardPlayer/CardPlayer";
import PlayedCards from "../PlayedCards/PlayedCards";

export default function CardPlayArea(props: {
  currentPlayerId: string;
  cardsToHighlight: string[]
  player: Player;
  leftPlayer: OtherPlayer;
  topPlayer: OtherPlayer;
  rightPlayer?: OtherPlayer;
  selectCard: any;
}) {
  return (
    <Container>
      <Row>
        <OtherCardPlayer
          player={props.topPlayer}
          isTurn={props.topPlayer.id === props.currentPlayerId}
          rotateCards={false}
          isLeft={false}
        />
      </Row>
      <Row>
        <Col>
          <OtherCardPlayer
            player={props.leftPlayer}
            isTurn={props.leftPlayer.id === props.currentPlayerId}
            rotateCards={true}
            isLeft={true}
          />
        </Col>
        <Col xs={8}>
          <PlayedCards
            playedCard={props.player.selectedCard}
            leftPlayed={props.leftPlayer.selectedCard}
            topPlayed={props.topPlayer.selectedCard}
            rightPlayed={props.rightPlayer?.selectedCard}
          />
        </Col>
        <Col>
          {props.rightPlayer ? (
            <OtherCardPlayer
              player={props.rightPlayer}
              isTurn={props.rightPlayer.id === props.currentPlayerId}
              rotateCards={true}
              isLeft={false}
            />
          ) : null}
        </Col>
      </Row>
      <Row>
        <CardPlayer
          player={props.player}
          cardsToHighlight={props.cardsToHighlight}
          isTurn={props.player.id === props.currentPlayerId}
          selectCard={props.selectCard}
        />
      </Row>
    </Container>
  );
}
