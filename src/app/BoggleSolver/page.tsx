"use client";

import { ChangeEvent, useState } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import "./BoggleSolver.scss";

export default function BoggleSolverPage() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [wordGroups, setWordGroups] = useState<WordGroups[]>([]);
  const [dice, setDice] = useState<string[]>(["A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A"]);
  const [diceString, setDiceString] = useState("AAAAAAAAAAAAAAAA");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);
  };

  const uploadImage = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:5101/boggle", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const res: BoggleResults = await response.json();
        setWordGroups(res.results);
        setDice(res.readGrid);
        setDiceString(res.readGrid.map((d) => (d.toUpperCase() === "QU" ? "Q" : d)).join(""));
      }
    }
  };

  const correctGrid = async () => {
    if (diceString) {
      const data = { boggleString: diceString };
      const response = await fetch("http://localhost:5101/bogglestring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const res: BoggleResults = await response.json();
        setWordGroups(res.results);
        setDice(res.readGrid);
        setDiceString(res.readGrid.map((d) => (d.toUpperCase() === "QU" ? "Q" : d)).join(""));
      }
    }
  };

  const handleSelectChange = (index: number, value: string) => {
    const newDice = [...dice];
    newDice[index] = value === "Q" ? "Qu" : value;
    setDice(newDice);
    setDiceString(newDice.map((d) => (d.toUpperCase() === "QU" ? "Q" : d)).join(""));
  };

  return (
    <>
      <Container>
        <Row className="pt-4">
          <Col lg={4}>
            <input className="form-control" type="file" onChange={handleChange} accept="image/*;capture=camera"/>
          </Col>
          <Col lg={2}>
            <button onClick={uploadImage} className="btn btn-primary">
              Upload
            </button>
          </Col>
          <Col lg={2}>
            <div className="dice-grid">
              {dice.map((x, i) => (
                <div key={i}>
                  <CharSelect currentValue={x} index={i} handleChange={handleSelectChange} />
                </div>
              ))}
            </div>
          </Col>
          <Col lg={2}>
            <button onClick={correctGrid} className="btn btn-primary">
              Submit Correction
            </button>
          </Col>
        </Row>

        <Row xs={1} md={2} lg={4} className="g-4 pt-4">
          {wordGroups.map((x) => (
            <Col key={x.length}>
              <Card style={{ height: "100%" }}>
                <Card.Header>
                  <Card.Title>{x.length} letter words</Card.Title>
                </Card.Header>

                <ListGroup className="list-group-flush">
                  <ListGroup.Item>Count: {x.count}</ListGroup.Item>
                  <ListGroup.Item>{x.words.join(" ")}</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

function CharSelect({
  index,
  currentValue,
  handleChange,
}: {
  index: number;
  currentValue: string;
  handleChange: (index: number, value: string) => void;
}) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleChange(index, value);
  };

  return (
    <select onChange={onChange} value={currentValue === "Qu" ? "Q" : currentValue}>
      {chars.map((c) => (
        <option key={c} value={c}>
          {c === "Q" ? "Qu" : c}
        </option>
      ))}
    </select>
  );
}

interface BoggleResults {
  results: WordGroups[];
  readGrid: string[];
}

interface WordGroups {
  length: number;
  count: number;
  words: string[];
}
