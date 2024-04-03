"use client";

import { useDrop } from "react-dnd";
import { ReactNode } from "react";
import "./DroppableTokenPile.scss";

export default function DroppableTokenPile({ children }: { children?: ReactNode }) {
  const id = `${NaN},${NaN}`;

  const [, drop] = useDrop(() => ({
    accept: "token",
    drop: () => {
      return { row: NaN, column: NaN };
    },
  }));

  return (
    <div id={id} ref={drop} className="token-pile">
      {children}
    </div>
  );
}
