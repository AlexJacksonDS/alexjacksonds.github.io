export const Height = 18;
export const Width = 10;

export function getFreshBoard(): BlockSquare[][] {
  return Array(Height)
    .fill(0)
    .map(() => Array(Width).fill(BlockSquare.Empty));
}

export function initialPosition() {
  return [0, Math.floor(Width / 2 - 2 / 2)];
}

export enum BlockSquare {
  Empty = "empty",
  Red = "red",
  Blue = "blue",
  Purple = "purple",
  Green = "green",
  Yellow = "yellow",
  Orange = "orange",
  LightBlue = "lightblue",
}

export interface ActiveBlock {
  position: number[];
  block: BlockSquare[][];
  nextBlock: BlockSquare[][];
}

export const I = [
  [BlockSquare.Empty, BlockSquare.Empty, BlockSquare.Empty, BlockSquare.Empty],
  [BlockSquare.Red, BlockSquare.Red, BlockSquare.Red, BlockSquare.Red],
  [BlockSquare.Empty, BlockSquare.Empty, BlockSquare.Empty, BlockSquare.Empty],
  [BlockSquare.Empty, BlockSquare.Empty, BlockSquare.Empty, BlockSquare.Empty],
];

export const O = [
  [BlockSquare.Blue, BlockSquare.Blue],
  [BlockSquare.Blue, BlockSquare.Blue],
];

export const L = [
  [BlockSquare.Empty, BlockSquare.Purple, BlockSquare.Empty],
  [BlockSquare.Empty, BlockSquare.Purple, BlockSquare.Empty],
  [BlockSquare.Empty, BlockSquare.Purple, BlockSquare.Purple],
];

export const J = [
  [BlockSquare.Empty, BlockSquare.Green, BlockSquare.Empty],
  [BlockSquare.Empty, BlockSquare.Green, BlockSquare.Empty],
  [BlockSquare.Green, BlockSquare.Green, BlockSquare.Empty],
];

export const T = [
  [BlockSquare.Empty, BlockSquare.Empty, BlockSquare.Empty],
  [BlockSquare.Yellow, BlockSquare.Yellow, BlockSquare.Yellow],
  [BlockSquare.Empty, BlockSquare.Yellow, BlockSquare.Empty],
];

export const Z = [
  [BlockSquare.Orange, BlockSquare.Orange, BlockSquare.Empty],
  [BlockSquare.Empty, BlockSquare.Orange, BlockSquare.Orange],
  [BlockSquare.Empty, BlockSquare.Empty, BlockSquare.Empty],
];

export const S = [
  [BlockSquare.Empty, BlockSquare.LightBlue, BlockSquare.LightBlue],
  [BlockSquare.LightBlue, BlockSquare.LightBlue, BlockSquare.Empty],
  [BlockSquare.Empty, BlockSquare.Empty, BlockSquare.Empty],
];

export const blocks = [I, O, L, J, S, Z, T];

export type Game = {
  isLost: boolean;
  board: BlockSquare[][];
  activeBlock: ActiveBlock | undefined;
};

export enum Action {
  Down = "down",
  Tick = "tick",
  Left = "left",
  Right = "right",
  Rotate = "rotate",
}

export function updateGame(game: Game, action: Action): Game {
  switch (action) {
    case Action.Down:
    case Action.Tick:
      return drop(game);
    case Action.Left:
      return moveLaterally(game, Direction.Left);
    case Action.Right:
      return moveLaterally(game, Direction.Right);
    case Action.Rotate: {
      return rotateActive(game);
    }
  }
}

const enum Direction {
  Down = "down",
  Left = "left",
  Right = "right",
}

function moveLaterally(game: Game, direction: Direction): Game {
  if (!game.isLost && game.activeBlock) {
    const newPosition = moveActiveBlock(game, direction);
    return {
      ...game,
      activeBlock: {
        ...game.activeBlock,
        position: newPosition,
      },
    };
  }
  return game;
}

function rotateActive(game: Game): Game {
  if (!game.isLost && game.activeBlock) {
    const newBlock = rotateMatrix(game.activeBlock);
    if (validateNewBlockPosition(game, game.activeBlock.position, newBlock)) {
      return {
        ...game,
        activeBlock: {
          ...game.activeBlock,
          block: newBlock,
        },
      };
    }
  }
  return game;
}

function moveActiveBlock(game: Game, direction: Direction): number[] {
  if (game.activeBlock) {
    let newPosition: number[] | undefined;
    switch (direction) {
      case Direction.Down:
        newPosition = [game.activeBlock.position[0] + 1, game.activeBlock.position[1]];
        break;
      case Direction.Left:
        newPosition = [game.activeBlock.position[0], game.activeBlock.position[1] - 1];
        break;
      case Direction.Right:
        newPosition = [game.activeBlock.position[0], game.activeBlock.position[1] + 1];
        break;
      default:
        newPosition = [game.activeBlock.position[0], game.activeBlock.position[1]];
        break;
    }
    return validateNewBlockPosition(game, newPosition, game.activeBlock.block)
      ? newPosition
      : game.activeBlock.position;
  }
  return [0, 0];
}

function drop(game: Game) {
  if (!game.isLost) {
    if (!game.activeBlock) {
      return {
        ...game,
        activeBlock: {
          position: initialPosition(),
          block: blocks[Math.floor(Math.random() * blocks.length)],
          nextBlock: blocks[Math.floor(Math.random() * blocks.length)],
        },
      };
    } else {
      const newPosition = moveActiveBlock(game, Direction.Down);
      if (newPosition === game.activeBlock.position) {
        game = placeBlockInBoard(game);
        if (validateNewBlockPosition(game, initialPosition(), game.activeBlock!.nextBlock)) {
          return {
            ...game,
            board: removeFullLines(game.board),
            activeBlock: {
              position: initialPosition(),
              block: game.activeBlock!.nextBlock,
              nextBlock: blocks[Math.floor(Math.random() * blocks.length)],
            },
          };
        } else {
          if (game.board[0].every((s) => s === BlockSquare.Empty)) {
            game = placePartialBlockInBoard(game, game.activeBlock!.nextBlock);
          }
          return {
            ...game,
            isLost: true,
          };
        }
      } else {
        return {
          ...game,
          activeBlock: {
            ...game.activeBlock,
            position: newPosition,
          },
        };
      }
    }
  }
  return game;
}

function removeFullLines(board: BlockSquare[][]): BlockSquare[][] {
  const boardCopy: BlockSquare[][] = JSON.parse(JSON.stringify(board));
  for (var i = 0; i < board.length; i++) {
    if (board[i].every((s) => s !== BlockSquare.Empty)) {
      boardCopy.splice(i, 1);
      boardCopy.unshift(Array(Width).fill(BlockSquare.Empty));
    }
  }
  return boardCopy;
}

function placeBlockInBoard(game: Game): Game {
  const boardCopy = [...game.board];
  if (game.activeBlock) {
    for (var i = 0; i < game.activeBlock.block.length; i++) {
      for (var j = 0; j < game.activeBlock.block[0].length; j++) {
        if (game.activeBlock.block[i][j] !== BlockSquare.Empty) {
          boardCopy[game.activeBlock.position[0] + i][game.activeBlock.position[1] + j] = game.activeBlock.block[i][j];
        }
      }
    }
  }

  return { ...game, board: boardCopy };
}

function placePartialBlockInBoard(game: Game, block: BlockSquare[][]): Game {
  const boardCopy = [...game.board];
  for (var i = block.length - 1; i >= 0; i--) {
    for (var j = block[0].length - 1; j >= 0; j--) {
      if (block[i][j] !== BlockSquare.Empty) {
        boardCopy[0][Math.floor(Width / 2 - 2 / 2) + j] = block[i][j];
      }
    }
    if (boardCopy[0].filter(s => s!==BlockSquare.Empty).length > 0) {
        break;
    }
  }
  return { ...game, board: boardCopy };
}

function validateNewBlockPosition(game: Game, position: number[], block: BlockSquare[][]) {
  for (var i = 0; i < block.length; i++) {
    for (var j = 0; j < block[0].length; j++) {
      if (block[i][j] !== BlockSquare.Empty) {
        if (
          position[0] + i < 0 ||
          position[0] + i >= Height ||
          position[1] + j < 0 ||
          position[1] + j >= Width ||
          game.board[position[0] + i][position[1] + j] !== BlockSquare.Empty
        ) {
          return false;
        }
      }
    }
  }

  return true;
}
function rotateMatrix(activeBlock: ActiveBlock): BlockSquare[][] {
  return activeBlock.block[0].map((val, index) => activeBlock.block.map((row) => row[index]).reverse());
}
