'use client';

import { useEffect, useState } from "react";
import { Button, Container, Form, FormControl } from "react-bootstrap";
import { getAnswerFromOfferString, getDataChannelForGame, getOfferString, getPeerConnection, setAnswerStringOnConnection } from "../services/rtcService"

export default function SecondPage() {
  const [offerString, setOfferString] = useState("placeholder");
  const [answerString, setAnswerString] = useState("placeholder");
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

  useEffect(() => {
    if (!peerConnection) {
      setPeerConnection(getPeerConnection());
    }
    // if (!dataChannel && peerConnection) {
    //   setDataChannel(getDataChannelForGame(peerConnection, "chat", () => { }))
    // }
  });

  const generateOffer = async () => {
    if (!peerConnection) {
      return;
    }
    const offer = await getOfferString(peerConnection)
    setOfferString(offer ?? "");
  };

  const generateAnswer = async () => {
    if (!peerConnection) {
      return;
    }
    const answer = await getAnswerFromOfferString(peerConnection, offerString)
    setAnswerString(answer ?? "");
  }

  const submitAnswer = () => {
    if (!peerConnection) {
      return;
    }
    setAnswerStringOnConnection(peerConnection, answerString);
  }

  return (
    <main>
      <Container>
        <Form>
          <Button onClick={generateOffer}>Generate Offer string</Button>
          <Form.Group className="mb-3" controlId="formOffer">
            <Form.Label>Offer</Form.Label>
            <FormControl as="textarea" readOnly={true} value={offerString} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={generateAnswer}>
            Generate Answer from Offer
          </Button>
          <Form.Group className="mb-3" controlId="formAnswer">
            <Form.Label>Answer</Form.Label>
            <FormControl as="textarea" />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={submitAnswer}>
            Submit Answer
          </Button>
        </Form>
      </Container>
    </main>
  )
}

