'use client';

import { Chess as ChessJS, Square } from "chess.js";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ChessBoard from "../components/ChessBoard/ChessBoard";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";

export default function Chess() {
  const searchParams = useSearchParams();
  const gameId = searchParams?.get("id");
  const [id, setId] = useState("");
  const [chess, setChessJS] = useState(new ChessJS());
  const [fen, setFen] = useState(new ChessJS().fen())
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
      socket = io("https://ajj-test.azurewebsites.net");
      socket.on('id', (id: string) => {
        setId(id);
        if (socket){
          socket.emit('newGame', {gameId, fen, playerId: id});
        }
      });
    
      socket.on('fen', (fen: string) => {
        setFen(fen);
        setChessJS(new ChessJS(fen));
      });
      setSocket(socket);
    }

    window.onbeforeunload = () => {
      socket?.disconnect();
    }
  })

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
      if (socket){
        socket.emit('sendFen', {gameId: gameId, playerId: id, fen: chess.fen()});
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