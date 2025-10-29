import { TerrainCard } from "@/types/cartographers";
import { Col, Row } from "react-bootstrap";
import CartTile from "../Tile/Tile";
import "./CurrentCard.scss";

export default function CurrentCard({ card, isRuin }: { card?: TerrainCard; isRuin: boolean }) {
  if (!card) return null;

  return (
    <Row>
      <Col className="d-flex">
        <div className="terrainCard">
          <h3>
            {card.title} : {card.value}
          </h3>
          <div className="allowedShapes">
            {card.validTerrain.map((vt, i) => (
              <div key={i} className="shape">
                {vt.map((x, j) => (
                  <Row key={j}>
                    <Col className="d-flex justify-content-center">
                      {x.map((y, k) => (
                        <div key={`${j},${k}`}>
                          <CartTile tile={{ terrain: y, isRuin: false }} small={true} />
                        </div>
                      ))}
                    </Col>
                  </Row>
                ))}
              </div>
            ))}
          </div>
          {isRuin ? <p>Must be placed on a ruin</p> : null}
        </div>
      </Col>
    </Row>
  );
}
