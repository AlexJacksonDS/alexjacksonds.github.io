import { BoardTile, DropResult, GameState } from "@/types/railRoadInk";
import _ from "lodash";

export function moveTile(gameState: GameState, dropResult: DropResult, stackId: string) {
  const newGameState = _.cloneDeep(gameState);
  if (dropResult.id.includes(",")) {
    const ids = dropResult.id.split(",").map((id) => parseInt(id));

    let boardTile: BoardTile | undefined;
    if (stackId.includes("dice")) {
      boardTile = gameState.dice.find((x) => x.id === stackId);
      newGameState.dice = gameState.dice.filter((x) => x.id !== stackId);
    }

    if (stackId.includes("special")) {
      console.log(stackId);
      const specials = [...gameState.specials];
      boardTile = specials.find((x) => x.id === stackId);
      newGameState.specials = specials.filter((x) => x.id !== boardTile?.id);
    }

    newGameState.board[ids[0]][ids[1]].tile = boardTile?.tile;
  }
  return newGameState;
}
