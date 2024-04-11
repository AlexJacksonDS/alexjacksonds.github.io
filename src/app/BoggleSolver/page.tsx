"use client";

import { ChangeEvent, useState } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";

export default function BoggleSolverPage() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [wordGroups, setWordGroups] = useState<WordGroups[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);
  };

  const uploadImage = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("https://ajj-sig-test.azurewebsites.net/boggle", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const res: WordGroups[] = await response.json();
        setWordGroups(res);
      }
    }
  };

  return (
    <>
      <Container>
        <Row className="pt-4">
          <Col>
            <input className="form-control" type="file" onChange={handleChange} />
          </Col>
          <Col>
            <button onClick={uploadImage} className="btn btn-primary">
              Upload
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

interface WordGroups {
  length: number;
  count: number;
  words: string[];
}
