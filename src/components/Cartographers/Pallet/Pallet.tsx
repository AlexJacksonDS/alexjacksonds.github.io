"use client";

import { Terrain } from "@/types/cartographers";
import { Col, Row } from "react-bootstrap";
import CartTile from "../Tile/Tile";
import { CartographersContext } from "../context";
import { ReactNode, useContext } from "react";
import "./Pallet.scss";

export default function Pallet({
  selectedTerrain,
  allowedTerrainTypes,
}: {
  selectedTerrain?: Terrain;
  allowedTerrainTypes: Terrain[];
}) {
  const context = useContext(CartographersContext);

  function onClick(terrain: Terrain) {
    if (allowedTerrainTypes.includes(terrain)) {
      context.handlePalletClick(terrain);
    }
  }

  function PalletCol({ terrain }: { terrain: Terrain }) {
    return (
      <Col onClick={() => onClick(terrain)} className="d-flex justify-content-center align-items-center">
        {selectedTerrain === terrain ? (
          <Highlight>
            <CartTile tile={{ terrain, isRuin: false }} />
          </Highlight>
        ) : (
          <div>
            <CartTile tile={{ terrain, isRuin: false }} />
          </div>
        )}
      </Col>
    );
  }

  function Highlight({ children }: { children: ReactNode }) {
    return <div className="circle d-flex justify-content-center align-items-center">{children}</div>;
  }

  return (
    <Row className="pallet">
      <PalletCol terrain={Terrain.Forest} />
      <PalletCol terrain={Terrain.Field} />
      <PalletCol terrain={Terrain.Water} />
      <PalletCol terrain={Terrain.Town} />
      <PalletCol terrain={Terrain.Monster} />
    </Row>
  );
}
