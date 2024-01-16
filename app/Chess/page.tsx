'use client';

import { Chess as ChessJS, Square } from "chess.js";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ChessBoard from "../components/ChessBoard/ChessBoard";
import { Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { getPieceUnicodeFromString } from "../helpers/pieceUnicodeHelper";
import './Chess.scss';
import getSocket from "../services/socket.service";

export default function Chess() {
  const searchParams = useSearchParams();
  const gameId = searchParams?.get("id");
  const [id, setId] = useState("");
  const [chess, setChessJS] = useState(new ChessJS());
  const [pgn, setPgn] = useState(new ChessJS().pgn());
  const [selectedSquare, setSelectedSquare] = useState<Square | undefined>();
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [myColour, setMyColour] = useState<string | undefined>();
  let [socket, setSocket] = useState<Socket<any, any> | null>(null);

  const isCheck = chess.isCheck();
  const isDraw = chess.isDraw();
  const isStaleMate = chess.isStalemate();
  const isCheckMate = chess.isCheckmate();

  useEffect(() => {
    if (!socket) {
      socket = getSocket({ idCallback: handleId, fenCallback: handleFen });
      setSocket(socket);
    }

    window.onbeforeunload = () => {
      socket?.disconnect();
    };
  });

  const handleFen = (fen: string) => {
    setPgn(fen);
    const newChess = new ChessJS();
    newChess.loadPgn(fen);
    setChessJS(newChess);
  };

  const handleId = (id: string) => {
    setId(id);
    if (socket) {
      socket.emit('newGame', { gameId, fen: pgn, playerId: id });
    }
  };

  function handleClick(clickedSquare?: Square) {
    if (isCheckMate || isDraw || isStaleMate || !clickedSquare) {
      return;
    }
    console.log(selectedSquare);
    console.log(possibleMoves);
    console.log(clickedSquare);
    if (selectedSquare && possibleMoves && clickedSquare !== selectedSquare) {
      if (!possibleMoves.find(pm => pm.includes(clickedSquare)) && !isCastle(clickedSquare, possibleMoves, selectedSquare)) {
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
      setPgn(chess.pgn());
      if (socket) {
        socket.emit('sendFen', { gameId: gameId, playerId: id, fen: chess.pgn() });
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

  function isCastle(squareCode: string, possibleMoves: string[], selectedSquare?: string) {
    if (selectedSquare === 'e1') {
        if (squareCode === 'g1') {
            return possibleMoves.includes('O-O')
        } else if (squareCode === 'c1') {
            return possibleMoves.includes('O-O-O')
        }
    }
    if (selectedSquare === 'e8') {
        if (squareCode === 'g8') {
            return possibleMoves.includes('O-O')
        } else if (squareCode === 'c8') {
            return possibleMoves.includes('O-O-O')
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

  const whiteCaptures = chess
    .history({ verbose: true })
    .filter(move => move.captured && move.color === "w")
    .map(move => getPieceUnicodeFromString(`${move.captured}b`))
    .join(' ');
  const blackCaptures = chess
    .history({ verbose: true })
    .filter(move => move.captured && move.color === "b")
    .map(move => getPieceUnicodeFromString(`${move.captured}w`))
    .join(' ');

  return (
    <main>
      <Container>
        <Row className="g-0-bottom">
          <Col className="g-0">
            <Container className="faux-borders-extra-thin">
              <Container className="captured-pieces w dark">
                {blackCaptures}
              </Container>
            </Container>
          </Col>
          <Col className="g-0">
            <Container className="faux-borders-thin">
              <ChessBoard board={chess.board()}
                onClick={(clickedSquare) => handleClick(clickedSquare)}
                selectedSquare={selectedSquare}
                possibleMoves={possibleMoves}
                previousMove={chess.history({ verbose: true }).length > 0 ? chess.history({ verbose: true }).at(-1)?.lan : ""} />
            </Container>
          </Col>
          <Col className="g-0">
            <Container className="faux-borders-extra-thin">
              <Container className="captured-pieces b light bottom">
                {whiteCaptures}
              </Container>
            </Container>
          </Col>
        </Row>
        <Row className="black-background g-0-top text-center">
          <Col>
            {!isCheckMate && !isDraw && !isStaleMate ? <p>{`It is currently ${chess.turn() === 'w' ? "White" : "Black"}'s turn`}</p> : null}
            {isCheckMate ? <p>{`${chess.turn() === 'w' ? "Black" : "White"} wins`}</p> : null}
            {isCheck && !isCheckMate ? <p>{`${chess.turn() === 'w' ? "White" : "Black"} is in check`}</p> : null}
            {isDraw ? <p>Game ended in draw</p> : null}
            {isStaleMate ? <p>Game ended in stalemate</p> : null}
          </Col>
        </Row>
      </Container>
    </main>
  )
}