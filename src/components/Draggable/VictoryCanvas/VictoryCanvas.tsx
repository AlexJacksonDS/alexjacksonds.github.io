"use client";
import { memo, useEffect, useRef } from "react";
import { Card } from "@/types/draggableCards";

export const VictoryCanvas = memo(function VictoryCanvas({ piles }: { piles: Map<string, Card[]>; }) {
  const dpr = window.devicePixelRatio;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const keys = [...piles.keys()];
      const rects = keys.map((k) => document.getElementById(k)!.getBoundingClientRect());
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        keys.forEach(function (key, i) {
          setTimeout(function () {
            const pileReverse = [...piles.get(key)!].reverse();
            pileReverse.forEach(function (card, j) {
              setTimeout(function () {
                const img = document.getElementById(`${card.id}-img`) as HTMLImageElement;
                startFall(canvas, context, img, rects[i]);
              }, j * 1000);
            });
          }, i * 1000);
        });
      }
    }
  }, [piles]);

  function fallIteration(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    img: HTMLImageElement,
    pos: { top: number; left: number; },
    dx: number,
    dy: number
  ) {
    context.drawImage(img, pos.left, pos.top, img.width, img.height);
    var newTop = Math.min(canvas.height - img.height, pos.top + dy);
    var newPos = {
      left: pos.left + dx,
      top: newTop,
    };
    if (Math.abs(newTop - (canvas.height - img.height)) < 5) {
      if (dy < 0 || dy > 20) {
        dy *= -1 * 0.7;
        setTimeout(function () {
          fallIteration(canvas, context, img, newPos, dx, dy);
        }, 20);
      }
    } else {
      dy = dy - -3;
      setTimeout(function () {
        fallIteration(canvas, context, img, newPos, dx, dy);
      }, 20);
    }
  }

  function startFall(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    img: HTMLImageElement,
    domRect: DOMRect
  ) {
    var dx = Math.floor(Math.random() * 10) + 5;
    if (Math.floor(Math.random() * 10) > 5) {
      dx = -dx;
    }
    setTimeout(function () {
      fallIteration(canvas, context, img, { top: domRect.top, left: domRect.left }, dx, 0);
    }, 200);
  }

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth * dpr}
      height={window.innerHeight * dpr}
      id="victory-canvas"
      style={{ zIndex: 500, position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }} />
  );
});
