"use client";

import { Board, Terrain } from "@/types/cartographers";
import { Col, Container, Row } from "react-bootstrap";
import Tile from "../Tile/Tile";
import { useContext } from "react";
import { CartographersContext } from "../context";

export default function DisplayBoard({ board }: { board: Board }) {
  const context = useContext(CartographersContext);

  function onClick(i: number, j: number) {
    context.handleTileClick(i, j);
  }

  return (
    <Container>
      {board.map((x, i) => (
        <Row key={i}>
          <Col className="d-flex justify-content-center">
            {x.map((y, j) => (
              <div onClick={() => onClick(i, j)}>
                <Tile key={`${i},${j}`} tile={y} />
              </div>
            ))}
          </Col>
        </Row>
      ))}
    </Container>
  );
}
