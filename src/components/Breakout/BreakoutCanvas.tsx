"use client";

import { Game } from "@/types/breakout";
import { memo, useEffect, useRef } from "react";

export const BreakoutCanvas = memo(function BreakoutCanvas({ game }: { game: Game }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        // bat
        context.fillRect(game.batPos, 590, game.batWidth, 10);

        // ball
        context.fillRect(game.ballPos[0], game.ballPos[1], 10, 10);

        // bricks
        // game.board.map((x, i) => {
        //   x.map((y, j) => {
        //     if (y === 1) {
        //       context.fillRect(i * game.batWidth + 1, 10 * j + 1, game.batWidth - 1, 9);
        //     }
        //   });
        // });

        // bricks
        game.bricks.map(x => {
            context.fillRect(x.tlX + 1, x.tlY + 1, game.batWidth - 1, 9);
        })
      }
    }
  }, [game]);

  return (
    <canvas ref={canvasRef} width={500} height={600} id="breakout-canvas" style={{ height: "600px", width: "500px" }} />
  );
});
