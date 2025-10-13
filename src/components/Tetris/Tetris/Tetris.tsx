"use client";

import { Action, BlockSquare, getFreshBoard, updateGame } from "@/types/tetris";
import { useEffect, useReducer, useRef } from "react";
import "./Tetris.scss";
import Row from "../Row/Row";
import { TetrisContext } from "../tetrisContext";
import { Button } from "react-bootstrap";

export default function Tetris() {
  const [game, dispatch] = useReducer(updateGame, {
    isLost: false,
    board: getFreshBoard(),
    activeBlock: undefined,
    linesCleared: 0,
    score: 0,
  });

  const divRef = useRef(null);

  function renderActiveBlockInBoard(): BlockSquare[][] {
    const boardCopy = JSON.parse(JSON.stringify(game.board));
    if (game.activeBlock) {
      for (var i = 0; i < game.activeBlock.block.length; i++) {
        for (var j = 0; j < game.activeBlock.block[0].length; j++) {
          if (game.activeBlock.block[i][j] !== BlockSquare.Empty) {
            boardCopy[game.activeBlock.position[0] + i][game.activeBlock.position[1] + j] =
              game.activeBlock.block[i][j];
          }
        }
      }
    }

    return boardCopy;
  }

  useEffect(() => {
    (divRef.current as any).focus();
  });

  useEffect(() => {
    let interval: number | undefined;
    if (!game.isLost) {
      interval = window.setInterval(() => {
        dispatch(Action.Tick);
      }, (0.8 - Math.floor(game.linesCleared / 10) * 0.007) ** Math.floor(game.linesCleared / 10) * 1000);
    }

    return () => {
      window.clearInterval(interval);
    };
  }, [game.isLost, game.linesCleared]);

  const handleKeyDown = (key: string) => {
    if (key === "a") {
      dispatch(Action.Left);
    }
    if (key === "d") {
      dispatch(Action.Right);
    }
    if (key === "r") {
      dispatch(Action.Rotate);
    }
    if (key === "s") {
      dispatch(Action.Down);
    }
  };

  return (
    <div className="game-container">
        <div>Score: {game.score} Lines Cleared: {game.linesCleared}</div>
      <div className="tetris-container">
        <TetrisContext.Provider value={game}>
          <div ref={divRef} className="tetris-board" tabIndex={-1} onKeyDown={(e) => handleKeyDown(e.key)}>
            {renderActiveBlockInBoard().map((r, i) => (
              <Row key={i} squares={r} />
            ))}
          </div>
        </TetrisContext.Provider>
        <div className="tetris-controls">
          <div className="button-row">
            <Button onClick={() => handleKeyDown("a")}>{"<-"}</Button>
            <Button onClick={() => handleKeyDown("r")}>{"\u27F3"}</Button>
            <Button onClick={() => handleKeyDown("d")}>{"->"}</Button>
          </div>
          <div className="button-row">
            <Button onClick={() => handleKeyDown("s")}>{"\u2193"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
