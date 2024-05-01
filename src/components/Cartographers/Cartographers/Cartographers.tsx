"use client";

import { CartographersContext } from "../context";
import DisplayBoard from "../DisplayBoard/DisplayBoard";
import { Dispatch, SetStateAction, useState } from "react";
import "./Cartographers.scss";
import { Board, Terrain, defaultBoard, specialBoard } from "@/types/cartographers";
import Pallet from "../Pallet/Pallet";
import { Button, Col, Container, Form, FormGroup, Modal, Row } from "react-bootstrap";

interface CartographersResult {
  scoreOne: number;
  scoreTwo: number;
  monsterScore: number;
}

export default function Cartographers({ isSpecialBoard }: { isSpecialBoard?: boolean }) {
  const [board, setBoard] = useState(isSpecialBoard ? specialBoard : defaultBoard);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [brushTerrain, setBrushTerrain] = useState(Terrain.Empty);
  const [coins, setCoins] = useState(0);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [season, setSeason] = useState(1);

  const [cardA, setCardA] = useState("");
  const [cardB, setCardB] = useState("");
  const [cardC, setCardC] = useState("");
  const [cardD, setCardD] = useState("");

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
    if (board[i][j].terrain === Terrain.Empty) {
      const newBoard: Board = [...board];
      newBoard[i][j].terrain = brushTerrain;
      setBoard(newBoard);
      const newMoveHistory = [...moveHistory];
      newMoveHistory.push(`${i},${j}`);
      setMoveHistory(newMoveHistory);
    }
  }

  function undo() {
    const newMoveHistory = [...moveHistory];
    const move = newMoveHistory.pop();
    if (move) {
      const coords = move.split(",").map((x) => parseInt(x));
      const newBoard: Board = [...board];
      newBoard[coords[0]][coords[1]].terrain = Terrain.Empty;
      setBoard(newBoard);
      setMoveHistory(newMoveHistory);
    }
  }

  async function scoreRound() {
    const cards = getRoundCards(season);
    console.log(cards);
    if (cards && cards[0] && cards[1]) {
      const data = { cardOne: cards[0], cardTwo: cards[1], tiles: board };
      const response = await fetch("https://ajj-sig-test.azurewebsites.net/cartographersscore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const res: CartographersResult = await response.json();
        console.log(res);
        switch (season) {
          case 1:
            setOneAScore(res.scoreOne);
            setOneBScore(res.scoreTwo);
            setOneMonsterScore(res.monsterScore);
            setOneCoinScore(coins);
            break;
          case 2:
            setTwoBScore(res.scoreOne);
            setTwoCScore(res.scoreTwo);
            setTwoMonsterScore(res.monsterScore);
            setTwoCoinScore(coins);
            break;
          case 3:
            setThreeCScore(res.scoreOne);
            setThreeDScore(res.scoreTwo);
            setThreeMonsterScore(res.monsterScore);
            setThreeCoinScore(coins);
            break;
          case 4:
            setFourDScore(res.scoreOne);
            setFourAScore(res.scoreTwo);
            setFourMonsterScore(res.monsterScore);
            setFourCoinScore(coins);
            break;
          default:
            return undefined;
        }
        setSeason(season + 1);
        setShow(false);
      }
    }
  }

  function getRoundCards(roundNumber: number) {
    switch (roundNumber) {
      case 1:
        return [cardA, cardB];
      case 2:
        return [cardB, cardC];
      case 3:
        return [cardC, cardD];
      case 4:
        return [cardD, cardA];
      default:
        return undefined;
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
        <Row>
          <Col>
            <button className="form-control btn btn-primary" type="submit" onClick={undo}>
              Undo
            </button>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6} className="border">
            <Row>
              <Col>
                <h3 className="pt-1">Coins: {coins}</h3>
              </Col>
              <Col xs={3}>
                <Button className="button-fill-col" onClick={() => setCoins(coins + 1)}>
                  +
                </Button>
              </Col>
              <Col xs={3}>
                <Button className="button-fill-col" onClick={() => setCoins(coins - 1 < 0 ? 0 : coins - 1)}>
                  -
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={12} lg={6} className="border">
            <h3>
              Total:{" "}
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
            </h3>
          </Col>
        </Row>
        <Row>
          <Col className="border" xs={12} md={6} lg={3}>
            <p>Card A</p>
            <ScoringCardDropdown setCard={setCardA} value={cardA} />
          </Col>
          <Col className="border" xs={12} md={6} lg={3}>
            <p>Card B</p>
            <ScoringCardDropdown setCard={setCardB} value={cardB} />
          </Col>
          <Col className="border" xs={12} md={6} lg={3}>
            <p>Card C</p>
            <ScoringCardDropdown setCard={setCardC} value={cardC} />
          </Col>
          <Col className="border" xs={12} md={6} lg={3}>
            <p>Card D</p>
            <ScoringCardDropdown setCard={setCardD} value={cardD} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button className="button-fill-col" onClick={handleShow}>
              Score Round
            </Button>
          </Col>
        </Row>
        <Row>
          <RoundScores
            season="Spring"
            firstCardScore={oneAScore}
            firstCardLetter="A"
            secondCardScore={oneBScore}
            secondCardLetter="B"
            coinScore={oneCoinScore}
            monsterScore={oneMonsterScore}
          />
          <RoundScores
            season="Summer"
            firstCardScore={twoBScore}
            firstCardLetter="B"
            secondCardScore={twoCScore}
            secondCardLetter="C"
            coinScore={twoCoinScore}
            monsterScore={twoMonsterScore}
          />
          <RoundScores
            season="Autumn"
            firstCardScore={threeCScore}
            firstCardLetter="C"
            secondCardScore={threeDScore}
            secondCardLetter="D"
            coinScore={threeCoinScore}
            monsterScore={threeMonsterScore}
          />
          <RoundScores
            season="Winter"
            firstCardScore={fourDScore}
            firstCardLetter="D"
            secondCardScore={fourAScore}
            secondCardLetter="A"
            coinScore={fourCoinScore}
            monsterScore={fourMonsterScore}
          />
        </Row>
        <Row>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Score Round</Modal.Title>
            </Modal.Header>
            <Modal.Body>Score this round and move to the next season</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={scoreRound}>
                Score Round
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Container>
    </CartographersContext.Provider>
  );
}

function RoundScores({
  season,
  firstCardScore,
  firstCardLetter,
  secondCardScore,
  secondCardLetter,
  coinScore,
  monsterScore,
}: {
  season: string;
  firstCardScore: number;
  firstCardLetter: string;
  secondCardScore: number;
  secondCardLetter: string;
  coinScore: number;
  monsterScore: number;
}) {
  return (
    <Col xs={6} lg={3} className="border">
      <Container>
        <Row>
          <Col>{season}</Col>
        </Row>
        <Row>
          <Col>
            {firstCardLetter}: {firstCardScore}
          </Col>
          <Col>
            {secondCardLetter}: {secondCardScore}
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Coins: {coinScore}</Col>
          <Col>Monster: {monsterScore}</Col>
          <Col>Total: {firstCardScore + secondCardScore + coinScore + monsterScore}</Col>
        </Row>
      </Container>
    </Col>
  );
}

function ScoringCardDropdown({ setCard, value }: { setCard: Dispatch<SetStateAction<string>>; value: string }) {
  return (
    <Form.Select
      aria-label="Default select example"
      onChange={(e) => setCard(e.target.value)}
      defaultValue={value}
      className="mb-1"
    >
      <option disabled={true} value="">
        Select card
      </option>
      <option value="Borderlands">Borderlands</option>
      <option value="BrokenRoad">Broken Road</option>
      <option value="Cauldrons">Cauldrons</option>
      <option value="LostBarony">Lost Barony</option>
      <option value="CanalLake">Canal Lake (Cake)</option>
      <option value="GoldenGranary">Golden Granary</option>
      <option value="MagesValley">Mages Valley</option>
      <option value="ShoresideExpanse">Shoreside Expanse</option>
      <option value="GreatCity">Great City</option>
      <option value="GreengoldPlains">Greengold Plains</option>
      <option value="Shieldgate">Shieldgate</option>
      <option value="Wildholds">Wildholds</option>
      <option value="Greenbough">Greenbough</option>
      <option value="SentinelWood">Sentinel Wood</option>
      <option value="StonesideForest">Stoneside Forest</option>
      <option value="Treetower">Treetower</option>
    </Form.Select>
  );
}
