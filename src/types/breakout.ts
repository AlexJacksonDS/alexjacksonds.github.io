const width = 500;
const height = 600;

export type Game = {
  board: number[][];
  ballPos: number[];
  ballVector: number[];
  batPos: number;
  lives: number;
  isLost: boolean;
  batWidth: number;
};

export enum Action {
  Tick = "tick",
  Left = "left",
  Right = "right",
}

const batSpeed = 20;

export function updateGame(game: Game, action: Action): Game {
  switch (action) {
    case Action.Tick:
      return tick(game);
    case Action.Left:
      return moveBat(game, action);
    case Action.Right:
      return moveBat(game, action);
  }
}

function moveBat(game: Game, action: Action): Game {
  let newPos = game.batPos + (action === Action.Left ? -1 : 1) * batSpeed;
  if (newPos < 0) {
    newPos = 0;
  } else if (newPos > width - game.batWidth) {
    newPos = width - game.batWidth;
  }
  return {
    ...game,
    batPos: newPos,
  };
}

function tick(game: Game): Game {
  let newBallPos = [game.ballPos[0] + game.ballVector[0], game.ballPos[1] + game.ballVector[1]];

  if (game.ballPos[0] + game.ballVector[0] <= 0) {
    newBallPos[0] = 0;
  }

  if (game.ballPos[0] + game.ballVector[0] >= 490) {
    newBallPos[0] = 490;
  }

  if (game.ballPos[1] + game.ballVector[1] <= 0) {
    newBallPos[1] = 0;
  }

  if (game.ballPos[1] + game.ballVector[1] >= 590) {
    newBallPos[1] = 590;
  }

  let newBallVector = [...game.ballVector];
  if (ballTouchesBat(newBallPos, game)) {
    newBallVector = flipVector(false, game.ballVector);
  }
  if (ballTouchesTop(newBallPos)) {
    newBallVector = flipVector(false, game.ballVector);
  }
  if (ballTouchesBottom(newBallPos)) {
    newBallVector = flipVector(false, game.ballVector);
  }

  if (ballTouchesLeft(newBallPos)) {
    newBallVector = flipVector(true, game.ballVector);
  }
  if (ballTouchesRight(newBallPos)) {
    newBallVector = flipVector(true, game.ballVector);
  }
  return {
    ...game,
    ballPos: newBallPos,
    ballVector: newBallVector,
  };
}

function ballTouchesBat(newBallPos: number[], game: Game): boolean {
  console.log(newBallPos);
  console.log(game.batPos);
  if (newBallPos[1] >= 580) {
    if (newBallPos[0] >= game.batPos && newBallPos[0] <= game.batPos + game.batWidth) {
      console.log(newBallPos);
      return true;
    }
  }
  return false;
}

function ballTouchesTop(newBallPos: number[]): boolean {
  if (newBallPos[1] <= 0) {
    return true;
  }
  return false;
}

function ballTouchesBottom(newBallPos: number[]): boolean {
  if (newBallPos[1] >= 590) {
    return true;
  }
  return false;
}

function ballTouchesLeft(newBallPos: number[]): boolean {
  if (newBallPos[0] <= 0) {
    return true;
  }
  return false;
}

function ballTouchesRight(newBallPos: number[]): boolean {
  if (newBallPos[0] >= 490) {
    return true;
  }
  return false;
}

function flipVector(isSideContact: boolean, ballVector: number[]) {
  if (isSideContact) {
    return [-ballVector[0], ballVector[1]];
  } else {
    {
      return [ballVector[0], -ballVector[1]];
    }
  }
}

export function getFreshBoard(): number[][] {
  return Array(10)
    .fill(0)
    .map(() => Array(10).fill(1));
}
