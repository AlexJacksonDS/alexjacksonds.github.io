'use client';

import { useEffect, useState, KeyboardEvent, useRef } from "react";
import { Button, Container, FormControl, FormGroup } from "react-bootstrap";
import SimplePeer from "simple-peer";
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  id: string;
  message: string;
}

export default function SecondPage() {
  const peerRef = useRef<SimplePeer.Instance | undefined>();

  const [offerString, setOfferString] = useState("");
  const [answerString, setAnswerString] = useState("");
  const [chatInput, setChatInput] = useState('');
  const [chatArray, setChatArray] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!peerRef.current) {
      const p = new SimplePeer({
        initiator: location.hash === '#1',
        trickle: false
      })
      p.on('error', err => console.log('error', err))

      p.on('signal', data => {
        setOfferString(JSON.stringify(data));
      })

      p.on('connect', () => {
        console.log('CONNECT');
      })

      p.on('data', data => {
        setChatArray(oldArray => [...oldArray, {id: uuidv4(), message: `> ${data}`}]);
      })
      peerRef.current = p;
    }
  });

  const submitAnswer = () => {
    if (!peerRef.current) {
      return;
    }
    peerRef.current.signal(JSON.parse(answerString));
  }

  const chatOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code != 'Enter') return;
    if (!peerRef.current) {
      return;
    }
    const message = (e.target as HTMLInputElement).value;
    setChatArray(oldArray => [...oldArray, {id: uuidv4(), message}]);
    peerRef.current.send(message);
  }

  const copyOffer = () => {
    navigator.clipboard.writeText(offerString)
  }

  return (
    <main>
      <Container>
        <FormGroup className="mb-3">
          <FormControl as="textarea" value={offerString} readOnly={true} />
          <Button className="form-control" onClick={copyOffer}>Copy</Button>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl as="textarea" value={answerString} onChange={e => setAnswerString(e.target.value)} placeholder="Paste JSON here and hit enter" />
          <Button className="form-control" onClick={submitAnswer}>Copy</Button>
        </FormGroup>
      </Container>
      <br />
      <Container>
        <input id="chat" value={chatInput} onInput={e => setChatInput((e.target as HTMLInputElement).value)} onKeyUp={e => chatOnKeyUp(e)} />
      </Container>
      <br />
      <Container>
        {chatArray.map(chatMessage => <p key={chatMessage.id}>{chatMessage.message}</p>)}
      </Container>
    </main>
  )
}
