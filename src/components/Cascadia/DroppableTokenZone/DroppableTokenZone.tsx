"use client";

import { useDrop } from "react-dnd";
import { AnimalTypes } from "@/types/cascadia";
import DraggableToken from "../DraggableToken/DraggableToken";
import AnimalToken from "../AnimalToken/AnimalToken";

export default function DroppableTokenZone({
  row,
  column,
  animal,
  possibleAnimals,
}: {
  row: number;
  column: number;
  animal?: AnimalTypes;
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
      {animal ? (
        <DraggableToken id={id} animal={animal} isDraggable={true} />
      ) : (
        <AnimalToken possibleAnimals={possibleAnimals} />
      )}
    </div>
  );
}
