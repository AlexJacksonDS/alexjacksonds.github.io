'use client';

import { Chess, Square } from "chess.js";
import { useEffect, useState } from "react";
import { Button, Container, FormControl, FormGroup } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import ChessBoard from "../components/ChessBoard/ChessBoard";
const SimplePeerWrapper = require('simple-peer-wrapper');

const name = uuidv4();

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

  const [spw, setSpw] = useState<any | null>(null);

  useEffect(() => {
    if (!spw) {
      const spWrapper = new SimplePeerWrapper({serverUrl: "https://ajj-test.azurewebsites.net"});
      spWrapper.on('connect', console.log("Connected"));

      spWrapper.on('data', (data: any) => {
        const fen = data.data;
        setFen(fen);
        setChess(new Chess(fen));
      })

      spWrapper.connect();
      setSpw(spWrapper);
    }

    window.onbeforeunload = () => {
      spw.close();
    };
  });

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
      setFen(chess.fen());
      if (spw) {
        spw.send(chess.fen());
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
    </main>
  )
}