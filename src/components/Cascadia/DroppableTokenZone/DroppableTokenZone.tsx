"use client";

import { useDrop } from "react-dnd";
import { AnimalTypes } from "@/types/cascadia";
import AnimalToken from "../AnimalToken/AnimalToken";
import { ReactNode } from "react";

export default function DroppableTokenZone({
  row,
  column,
  children,
  possibleAnimals,
}: {
  row: number;
  column: number;
  children?: ReactNode;
  possibleAnimals: AnimalTypes[];
}) {
  const id = `${row},${column}`;

  const [, drop] = useDrop(
    () => ({
      accept: "token",
      drop: () => {
        return { row, column };
      },
    }),
    [row, column]
  );

  return (
    <div id={id} ref={drop} className="token-zone">
      {children ? children : <AnimalToken possibleAnimals={possibleAnimals} />}
    </div>
  );
}
