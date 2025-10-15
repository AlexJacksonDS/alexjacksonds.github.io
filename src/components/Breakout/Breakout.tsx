"use client";

import { Action, getFreshBoard, getStartBricks, updateGame } from "@/types/breakout";
import { useEffect, useReducer, useRef } from "react";
import { BreakoutContext } from "./breakoutContext";
import { Button } from "react-bootstrap";
import "./Breakout.scss";
import { BreakoutCanvas } from "./BreakoutCanvas";

export default function Breakout() {
  const [game, dispatch] = useReducer(updateGame, {
    board: getFreshBoard(),
    ballPos: [250, 450],
    ballVector: [5,5],
    batPos: 380,
    batWidth: 50,
    lives: 3,
    isLost: false,
    bricks :getStartBricks()
  });

  const divRef = useRef(null);

  useEffect(() => {
    (divRef.current as any).focus();
  });

  useEffect(() => {
    let interval: number | undefined;
    if (!game.isLost) {
      interval = window.setInterval(() => {
        dispatch(Action.Tick);
      }, 1000/50);
    }

    return () => {
      window.clearInterval(interval);
    };
  }, [game.isLost]);

  const handleKeyDown = (key: string) => {
    if (key === "a") {
      dispatch(Action.Left);
    }
    if (key === "d") {
      dispatch(Action.Right);
    }
  };

  return (
    <div className="game-container">
      <div className="breakout-container">
        <BreakoutContext.Provider value={game}>
          <div ref={divRef} className="breakout-board" tabIndex={-1} onKeyDown={(e) => handleKeyDown(e.key)}>
            {/* {renderActiveBlockInBoard().map((x, i) => (
              <div className="breakout-row" key={i}>
                {x.map((y, j) => (
                  <div className={"breakout-square " + (y === 0 ? "black" : "white")} key={j}></div>
                ))}
              </div>
            ))} */}
            <BreakoutCanvas game={game} />
          </div>
        </BreakoutContext.Provider>
        <div className="breakout-controls">
          <div className="button-row">
            <Button onClick={() => handleKeyDown("a")}>{"<-"}</Button>
            <Button onClick={() => handleKeyDown("d")}>{"->"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
