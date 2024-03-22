import { AnimalTypes, DropResult, GamePlayedTile } from "@/types/cascadia";
import { createContext } from "react";

interface DragHandlerContext {
  handleDragTile: (dropResult: DropResult, item: { id: string; tile: GamePlayedTile }) => void;
  handleDragToken: (dropResult: DropResult, item: { id: string; animal: AnimalTypes }) => void;
  handleTileClick: (row: number, column: number, tile?: GamePlayedTile) => void;
}
export const DragHandlerContext = createContext<DragHandlerContext>({
  handleDragTile: () => null,
  handleDragToken: () => null,
  handleTileClick: () => null,
});
