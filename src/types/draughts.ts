export type DraughtsTurn = 1 | 2;

export type DraughtsPiece = 0 | 1 | 2 | 3 | 4;

export type DraughtsBoard = DraughtsPiece[][];

export type DraughtsMove = {
  startI: number;
  startJ: number;
  endI: number;
  endJ: number;
  isJump: boolean;
};
