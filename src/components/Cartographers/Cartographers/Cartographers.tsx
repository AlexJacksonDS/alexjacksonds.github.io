"use client";

import { CartographersContext } from "../context";
import DisplayBoard from "../DisplayBoard/DisplayBoard";
import { useState } from "react";
import "./Cartographers.scss";
import { Board, Terrain, defaultBoard, specialBoard } from "@/types/cartographers";
import Pallet from "../Pallet/Pallet";
import { Col, Container, Form, FormGroup, Row } from "react-bootstrap";

export default function Cartographers({ isSpecialBoard }: { isSpecialBoard?: boolean }) {
  const [board, setBoard] = useState(isSpecialBoard ? specialBoard : defaultBoard);
  const [brushTerrain, setBrushTerrain] = useState(Terrain.Empty);
  const [coins, setCoins] = useState(0);

  const [oneAScore, setOneAScore] = useState(0);
  const [oneBScore, setOneBScore] = useState(0);
  const [oneCoinScore, setOneCoinScore] = useState(0);
  const [oneMonsterScore, setOneMonsterScore] = useState(0);

  const [twoBScore, setTwoBScore] = useState(0);
  const [twoCScore, setTwoCScore] = useState(0);
  const [twoCoinScore, setTwoCoinScore] = useState(0);
  const [twoMonsterScore, setTwoMonsterScore] = useState(0);

  const [threeCScore, setThreeCScore] = useState(0);
  const [threeDScore, setThreeDScore] = useState(0);
  const [threeCoinScore, setThreeCoinScore] = useState(0);
  const [threeMonsterScore, setThreeMonsterScore] = useState(0);

  const [fourDScore, setFourDScore] = useState(0);
  const [fourAScore, setFourAScore] = useState(0);
  const [fourCoinScore, setFourCoinScore] = useState(0);
  const [fourMonsterScore, setFourMonsterScore] = useState(0);

  function handlePalletClick(terrain: Terrain) {
    setBrushTerrain(terrain);
  }

  function handleTileClick(i: number, j: number) {
    console.log(`${i},${j}`);
    if (board[i][j].terrain === Terrain.Empty) {
      const newBoard: Board = [...board];
      newBoard[i][j].terrain = brushTerrain;
      console.log(newBoard);
      setBoard(newBoard);
    }
  }

  return (
    <CartographersContext.Provider value={{ handlePalletClick, handleTileClick }}>
      <Container className="cartographers">
        <Pallet
          selectedTerrain={brushTerrain}
          allowedTerrainTypes={[Terrain.Forest, Terrain.Field, Terrain.Water, Terrain.Town, Terrain.Monster]}
        />
        <DisplayBoard board={board} />
        <Row className="gx-5">
          <Col xs={12} lg={1} className="border">
            <FormGroup className="mb-2">
              <Form.Label>Coin Tracker</Form.Label>
              <Form.Control type="number" onChange={(e) => setCoins(parseInt(e.target.value))} value={coins} />
            </FormGroup>
          </Col>
          <RoundScores
            season="Spring"
            setFirstCardScore={setOneAScore}
            firstCardScore={oneAScore}
            firstCardLetter="A"
            setSecondCardScore={setOneBScore}
            secondCardScore={oneBScore}
            secondCardLetter="B"
            setCoinScore={setOneCoinScore}
            coinScore={oneCoinScore}
            setMonsterScore={setOneMonsterScore}
            monsterScore={oneMonsterScore}
          />
          <RoundScores
            season="Summer"
            setFirstCardScore={setTwoBScore}
            firstCardScore={twoBScore}
            firstCardLetter="B"
            setSecondCardScore={setTwoCScore}
            secondCardScore={twoCScore}
            secondCardLetter="C"
            setCoinScore={setTwoCoinScore}
            coinScore={twoCoinScore}
            setMonsterScore={setTwoMonsterScore}
            monsterScore={twoMonsterScore}
          />
          <RoundScores
            season="Autumn"
            setFirstCardScore={setThreeCScore}
            firstCardScore={threeCScore}
            firstCardLetter="C"
            setSecondCardScore={setThreeDScore}
            secondCardScore={threeDScore}
            secondCardLetter="D"
            setCoinScore={setThreeCoinScore}
            coinScore={threeCoinScore}
            setMonsterScore={setThreeMonsterScore}
            monsterScore={threeMonsterScore}
          />
          <RoundScores
            season="Winter"
            setFirstCardScore={setFourDScore}
            firstCardScore={fourDScore}
            firstCardLetter="D"
            setSecondCardScore={setFourAScore}
            secondCardScore={fourAScore}
            secondCardLetter="A"
            setCoinScore={setFourCoinScore}
            coinScore={fourCoinScore}
            setMonsterScore={setFourMonsterScore}
            monsterScore={fourMonsterScore}
          />
          <Col xs={12} lg={1} className="border">
            <p>Total:</p>
            <p className="display-6">
              {oneAScore +
                oneBScore +
                oneCoinScore +
                oneMonsterScore +
                twoBScore +
                twoCScore +
                twoCoinScore +
                twoMonsterScore +
                threeCScore +
                threeDScore +
                threeCoinScore +
                threeMonsterScore +
                fourDScore +
                fourAScore +
                fourCoinScore +
                fourMonsterScore}
            </p>
          </Col>
        </Row>
      </Container>
    </CartographersContext.Provider>
  );
}

function RoundScores({
  season,
  setFirstCardScore,
  firstCardScore,
  firstCardLetter,
  setSecondCardScore,
  secondCardScore,
  secondCardLetter,
  setCoinScore,
  coinScore,
  setMonsterScore,
  monsterScore,
}: {
  season: string;
  setFirstCardScore: (i: number) => void;
  firstCardScore: number;
  firstCardLetter: string;
  setSecondCardScore: (i: number) => void;
  secondCardScore: number;
  secondCardLetter: string;
  setCoinScore: (i: number) => void;
  coinScore: number;
  setMonsterScore: (i: number) => void;
  monsterScore: number;
}) {
  return (
    <Col xs={6} lg={2} className="border">
      <Row>
        <Col>{season}</Col>
      </Row>
      <Row>
        <ScoreControl setScore={setFirstCardScore} score={firstCardScore} label={firstCardLetter} />
        <ScoreControl setScore={setSecondCardScore} score={secondCardScore} label={secondCardLetter} />
        <Col></Col>
      </Row>
      <Row>
        <ScoreControl setScore={setCoinScore} score={coinScore} label="Coins" />
        <ScoreControl setScore={setMonsterScore} score={monsterScore} label="Monsters" />
        <Col>Total: {firstCardScore + secondCardScore + coinScore + monsterScore}</Col>
      </Row>
    </Col>
  );
}

function ScoreControl({ setScore, score, label }: { setScore: (i: number) => void; score: number; label: string }) {
  return (
    <Col xs={6} lg={4}>
      <FormGroup className="mb-2">
        <Form.Label>{label}</Form.Label>
        <input className="form-control" type="text" onChange={(e) => setScore(parseInt(e.target.value))} value={score} inputMode="numeric"/>
      </FormGroup>
    </Col>
  );
}
