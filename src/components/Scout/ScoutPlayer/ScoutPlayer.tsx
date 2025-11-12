import { Button, Col, Container, Row } from "react-bootstrap";
import "./ScoutPlayer.scss";
import { ScoutCard, ScoutGamePlayer } from "@/types/scout";
import Card from "../Card/ScoutCard";
import { Fragment, useState } from "react";

export default function ScoutPlayer(props: {
  player: ScoutGamePlayer;
  cardsToHighlight: number[];
  isTurn: boolean;
  isScouting: boolean;
  scoutCard?: ScoutCard;
  scoutIndex?: number;
  selectOrientation: (flipped: boolean) => void;
  selectCard: (index: number) => void;
  selectScoutLocation: (index: number) => void;
  selectScoutOrientation: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Container>
      <Row>
        <Col className={`text-center${props.isTurn ? " text-success" : ""}`}>
          {!props.player.hasSelectedOrientation ? (
            <>
              <Row>Select hand orientation</Row>
              <Row>
                <Col>
                  <Button onClick={() => setFlipped(!flipped)}>
                    Flip Cards
                  </Button>
                </Col>
                <Col>
                  <Button onClick={() => props.selectOrientation(flipped)}>
                    Select orientation
                  </Button>
                </Col>
              </Row>
            </>
          ) : null}
          {props.isScouting ? (
            <Row>
              <Col>
                <Button onClick={() => props.selectScoutOrientation()}>
                  Flip Scouted Card
                </Button>
              </Col>
            </Row>
          ) : null}
          {props.isTurn ? "It's your turn" : "Waiting for other players..."}
        </Col>
      </Row>
      <Row className="card-display-container">
        {props.player.hand ? Hand() : null}
      </Row>
    </Container>
  );

  function Hand() {
    if (props.isScouting) {
      return (
        <>
          {props.player.hand
            .map((c) => {
              return {
                ...c,
                isFlipped: flipped ? !c.isFlipped : c.isFlipped,
              };
            })
            .map((card, index) => (
              <Fragment key={index}>
                <Col
                  className={`card-display g-0${
                    props.scoutIndex === index ? " highlighted" : ""
                  }`}
                  onClick={() => props.selectScoutLocation(index)}
                >
                  {props.scoutCard &&
                  props.scoutIndex &&
                  props.scoutIndex === index ? (
                    <Card card={props.scoutCard} />
                  ) : (
                    <PlaceholderCard />
                  )}
                </Col>
                <Col className={`card-display g-0`}>
                  <Card card={card} />
                </Col>
              </Fragment>
            ))}
          <Col
            className={`card-display g-0`}
            onClick={() => props.selectScoutLocation(props.player.hand.length)}
          >
            {props.scoutCard &&
            props.scoutIndex &&
            props.scoutIndex === props.player.hand.length ? (
              <Card card={props.scoutCard} />
            ) : (
              <PlaceholderCard />
            )}
          </Col>
        </>
      );
    }
    return props.player.hand
      .map((c) => {
        return {
          ...c,
          isFlipped: flipped && !props.player.hasSelectedOrientation ? !c.isFlipped : c.isFlipped,
        };
      })
      .map((card, index) => (
        <Col
          key={index}
          className={`card-display g-0${
            props.cardsToHighlight.includes(index) ? " highlighted" : ""
          }`}
          onClick={() => props.selectCard(index)}
        >
          <Card card={card} />
        </Col>
      ));
  }
}

function PlaceholderCard() {
  return <div className="card placeholder-card"></div>;
}
