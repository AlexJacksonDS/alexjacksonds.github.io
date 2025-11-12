import { getCharacter } from "@/services/minesweeper.service";
import { Tile } from "@/types/minesweeper";
import { MutableRefObject, MouseEvent } from "react";
import { Row, Col } from "react-bootstrap";

export default function SquareBoard(props: {
  board: MutableRefObject<Tile[][]>;
  handleClick: (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    i: number,
    j: number
  ) => void;
  small: boolean;
  isLost: boolean;
}) {
  return (
    <Row className="pt-2">
      <Col>
        <div className="minesweeper">
          {props.board.current.map((r, i) => (
            <Row key={i} className="m-0">
              {r.map((c, j) => (
                <Col
                  key={j}
                  style={{
                    width: props.small ? 10 : 40 + "px",
                    maxWidth: props.small ? 10 : 40 + "px",
                    padding: 0,
                  }}
                >
                  <div
                    className={
                      "tile " +
                      (c.isRevealed
                        ? [
                            "zero",
                            "one",
                            "two",
                            "three",
                            "four",
                            "five",
                            "six",
                            "seven",
                            "eight",
                          ][c.value]
                        : "unrevealed ")
                    }
                    style={{
                      width: props.small ? 10 : 40 + "px",
                      fontSize: props.small ? 5 : 20 + "px",
                      borderWidth: props.small ? 1 : 3 + "px",
                      padding: props.small ? 0 : "2px 10px",
                    }}
                    onClick={(e) => props.handleClick(e, i, j)}
                    onContextMenu={(e) => props.handleClick(e, i, j)}
                  >
                    {getCharacter(c, props.isLost)}
                  </div>
                </Col>
              ))}
            </Row>
          ))}
        </div>
      </Col>
    </Row>
  );
}
