'use client';

import { Chess, Square } from "chess.js";
import { useEffect, useState } from "react";
import { Button, Container, FormControl, FormGroup } from "react-bootstrap";
import SimplePeer from "simple-peer";
import ChessBoard from "../components/ChessBoard/ChessBoard";

export default function SecondPage() {
  const [chess, setChess] = useState(new Chess());
  const [fen, setFen] = useState(new Chess().fen())
  const [selectedSquare, setSelectedSquare] = useState<Square | undefined>();
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [myColour, setMyColour] = useState<string | undefined>();

  const isCheck = chess.isCheck();
  const isDraw = chess.isDraw();
  const isStaleMate = chess.isStalemate();
  const isCheckMate = chess.isCheckmate();
  const [offerString, setOfferString] = useState("");
  const [answerString, setAnswerString] = useState("");
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [hideConnection, setHideConnection] = useState(false);

  useEffect(() => {
    if (!peer) {
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
        setHideConnection(true);
      })

      p.on('data', data => {
        const fen = new TextDecoder().decode(data);
        setFen(fen);
        setChess(new Chess(fen));
      })
      setPeer(p);
    }
  });

  const submitAnswer = () => {
    if (!peer) {
      return;
    }
    peer.signal(JSON.parse(answerString));
  }

  const copyOffer = () => {
    navigator.clipboard.writeText(offerString)
  }

  function handleClick(clickedSquare?: Square) {
    if (isCheckMate || isDraw || isStaleMate || !clickedSquare) {
      return;
    }
    if (selectedSquare && possibleMoves && clickedSquare !== selectedSquare) {
      if (!possibleMoves.find(pm => pm.includes(clickedSquare))) {
        setSelectedSquare(undefined);
        setPossibleMoves([]);
        return;
      }
      if (isPossiblePromotion(selectedSquare)) {
        var promotion = getPromotionOption();
        if (promotion) {
          chess.move({ from: selectedSquare, to: clickedSquare, promotion: promotion });
        }
      } else {
        chess.move({ from: selectedSquare, to: clickedSquare });
      }
      setSelectedSquare(undefined);
      setPossibleMoves([]);
      setMyColour(getMyColour());
      if (!peer) {
        return;
      }
      setFen(chess.fen());
      if (peer.connected) {
        peer.send(chess.fen());
      }
    } else {
      var piece = chess.get(clickedSquare);
      if (piece && piece.color === chess.turn() && isTurn(piece.color)) {
        var localPossibleMoves = chess.moves({ square: clickedSquare });
        setSelectedSquare(clickedSquare);
        setPossibleMoves(localPossibleMoves);
      }
    }
  }

  function getMyColour() {
    if (myColour) {
      return myColour;
    } else {
      return chess.turn() === 'w' ? 'b' : 'w';
    }
  }

  function isTurn(pieceColour: string) {
    if (myColour) {
      return myColour === pieceColour;
    } else {
      return true;
    }
  }

  function isPossiblePromotion(selectedSquare: Square) {
    var piece = chess.get(selectedSquare);
    return (piece.type === 'p' && piece.color === 'b' && selectedSquare.charAt(1) === '2')
      || (piece.type === 'p' && piece.color === 'w' && selectedSquare.charAt(1) === '7');
  }

  function getPromotionOption() {
    var piece = null;
    while (piece == null) {
      var input = prompt("Enter a piece to promote to: q = Queen, r = Rook, b = Bishop, n = Knight");
      if ((['q', 'r', 'b', 'n'].includes(input ?? ""))) {
        piece = input;
      }
      if (input === null) {
        return null;
      }
    }
    return piece;
  }

  return (
    <main>
      <Container>
        <ChessBoard board={chess.board()}
          onClick={(clickedSquare) => handleClick(clickedSquare)}
          selectedSquare={selectedSquare}
          possibleMoves={possibleMoves} />
      </Container>
      <br/>
      <Container className="text-center">
        {!isCheckMate && !isDraw && !isStaleMate ? <p>{`It is currently ${chess.turn() === 'w' ? "White" : "Black"}'s turn`}</p> : null}
        {isCheckMate ? <p>{`${chess.turn() === 'w' ? "Black" : "White"} wins`}</p> : null}
        {isCheck && !isCheckMate ? <p>{`${chess.turn() === 'w' ? "White" : "Black"} is in check`}</p> : null}
        {isDraw ? <p>Game ended in draw</p> : null}
        {isStaleMate ? <p>Game ended in stalemate</p> : null}
      </Container>
      <Container hidden={hideConnection}>
        <FormGroup className="mb-3">
          <FormControl as="textarea" value={offerString} readOnly={true} />
          <Button className="form-control" onClick={copyOffer}>Copy</Button>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl as="textarea" value={answerString} onChange={e => setAnswerString(e.target.value)} placeholder="Paste JSON here and hit submit" />
          <Button className="form-control" onClick={submitAnswer}>Submit</Button>
        </FormGroup>
      </Container>
    </main>
  )
}