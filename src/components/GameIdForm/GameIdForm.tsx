import { Dispatch, SetStateAction, KeyboardEvent } from "react";
import { Row, Col, Container, FormGroup, FormLabel } from "react-bootstrap";

export default function GameIdForm(props: {
  connectedToGame: boolean;
  gameId: string;
  setGameId: Dispatch<SetStateAction<string>>;
  gameIdOnKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void;
  gameIdDisabled: boolean;
  startGame?: () => void;
  isStartable?: boolean;
}) {
  return (
    <Row>
      <Col>
        <Container hidden={props.connectedToGame}>
          <FormGroup>
            <FormLabel>Game ID: </FormLabel>
            <input
              className="form-control"
              value={props.gameId}
              onInput={(e) =>
                props.setGameId((e.target as HTMLInputElement).value)
              }
              onKeyUp={(e) => props.gameIdOnKeyUp(e)}
              disabled={props.gameIdDisabled}
              placeholder="Enter to submit"
            />
          </FormGroup>
        </Container>
        {props.startGame !== undefined && props.isStartable !== undefined ? (
          <button
            className="btn btn-primary"
            onClick={props.startGame}
            hidden={!props.isStartable}
          >
            Start game
          </button>
        ) : null}
      </Col>
    </Row>
  );
}
