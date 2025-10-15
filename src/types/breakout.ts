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
  bricks: Brick[];
};

interface Brick {
  tlX: number;
  tlY: number;
  brX: number;
  brY: number;
}

export enum Action {
  Tick = "tick",
  Left = "left",
  Right = "right",
}

const batSpeed = 50;

export function updateGame(game: Game, action: { action: Action; dx?: number }): Game {
  if (action.dx) {
    return moveBatDx(game, action.dx);
  }
  switch (action.action) {
    case Action.Tick:
      return tick(game);
    case Action.Left:
      return moveBat(game, action.action);
    case Action.Right:
      return moveBat(game, action.action);
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

function moveBatDx(game: Game, dx: number): Game {
  let newPos = dx;
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
  const newBallPos = getNewPosition(game.ballPos, game.ballVector);

  let newBallVector = [...game.ballVector];

  const { hit, hitBrick, bounceVector, hitType } = ballTouchesBrick(newBallPos, game.bricks, game.ballVector);

  if (hit && hitBrick && bounceVector && hitType) {
    let remainingBricks = [...game.bricks];
    const index = game.bricks.indexOf(hitBrick);
    if (index > -1) {
      remainingBricks.splice(index, 1);
    }
    console.log([game.ballVector, hitBrick, bounceVector, hitType]);
    return {
      ...game,
      bricks: remainingBricks,
      ballPos: newBallPos,
      ballVector: bounceVector,
    };
  }

  if (ballTouchesBat(newBallPos, game)) {
    newBallVector = flipVector(false, game.ballVector);
  }
  if (ballTouchesTop(newBallPos)) {
    newBallVector = flipVector(false, game.ballVector);
  }

  if (ballTouchesLeft(newBallPos)) {
    newBallVector = flipVector(true, game.ballVector);
  }
  if (ballTouchesRight(newBallPos)) {
    newBallVector = flipVector(true, game.ballVector);
  }

  if (ballTouchesBottom(newBallPos)) {
    return {
      ...game,
      ballPos: newBallPos,
      ballVector: [0, 0],
      isLost: true,
    };
  }

  return {
    ...game,
    ballPos: newBallPos,
    ballVector: newBallVector,
  };
}

function ballTouchesBrick(
  ballPosition: number[],
  bricks: Brick[],
  currentVector: number[]
): { hit: boolean; hitBrick?: Brick; bounceVector?: number[]; hitType?: string } {
  if (ballPosition[1] > 100) {
    return { hit: false };
  }

  const ballPos = {
    tlX: ballPosition[0],
    tlY: ballPosition[1],
    brX: ballPosition[0] + 10,
    brY: ballPosition[1] + 10,
  };

  const potentialsHits = bricks.filter((x) =>
    rectanglesIntersect(ballPos.tlX, ballPos.tlY, ballPos.brX, ballPos.brY, x.tlX, x.tlY, x.brX, x.brY)
  );

  if (potentialsHits.length > 0) {
    const bottomHits = potentialsHits.filter((x) => determineContactType(ballPos, x, currentVector) === "bottom");
    if (bottomHits.length > 0) {
      return { hit: true, hitBrick: bottomHits[0], bounceVector: flipVector(false, currentVector), hitType: "bottom" };
    }

    const sideHits = potentialsHits.filter((x) => determineContactType(ballPos, x, currentVector) === "side");
    if (sideHits.length > 0) {
      return { hit: true, hitBrick: sideHits[0], bounceVector: flipVector(true, currentVector), hitType: "side" };
    }

    const topHits = potentialsHits.filter((x) => determineContactType(ballPos, x, currentVector) === "top");
    if (topHits.length > 0) {
      return { hit: true, hitBrick: topHits[0], bounceVector: flipVector(false, currentVector), hitType: "top" };
    }

    const cornerHits = potentialsHits.filter((x) => determineContactType(ballPos, x, currentVector) === "corner");
    if (cornerHits.length > 0) {
      return {
        hit: true,
        hitBrick: cornerHits[0],
        bounceVector: flipVector(true, flipVector(false, currentVector)),
        hitType: "corner",
      };
    }

    return { hit: true, hitBrick: potentialsHits[0] };
  }

  return { hit: false };
}

function determineContactType(
  ball: Brick,
  brick: Brick,
  currentVector: number[]
): "corner" | "side" | "bottom" | "top" {
  if ((ball.tlX === brick.brX && ball.tlY !== brick.brY) || (ball.brX === brick.tlX && ball.brY !== brick.tlY)) {
    return "side";
  }

  // Up corner hits only
  if (ball.tlX === brick.brX && ball.tlY === brick.brY && currentVector[1] < 0 && currentVector[0] < 0) {
    return "corner";
  }
  // Up corner hits only
  if (ball.tlX === brick.brX && ball.brY === brick.tlY && currentVector[1] < 0 && currentVector[0] > 0) {
    return "corner";
  }

  if (ball.brY === brick.tlY && ball.brX !== brick.tlX && ball.tlX !== brick.brX) {
    return "top";
  }

  return "bottom";
}

function rectanglesIntersect(
  minAx: number,
  minAy: number,
  maxAx: number,
  maxAy: number,
  minBx: number,
  minBy: number,
  maxBx: number,
  maxBy: number
) {
  return !(maxAx < minBx || minAx > maxBx || minAy > maxBy || maxAy < minBy);
}

function getNewPosition(position: number[], vector: number[]) {
  let newPos = [position[0] + vector[0], position[1] + vector[1]];

  if (position[0] + vector[0] <= 0) {
    newPos[0] = 0;
  }

  if (position[0] + vector[0] >= 490) {
    newPos[0] = 490;
  }

  if (position[1] + vector[1] <= 0) {
    newPos[1] = 0;
  }

  if (position[1] + vector[1] >= 590) {
    newPos[1] = 590;
  }
  return newPos;
}

function ballTouchesBat(newBallPos: number[], game: Game): boolean {
  if (newBallPos[1] >= 580) {
    if (newBallPos[0] >= game.batPos && newBallPos[0] <= game.batPos + game.batWidth) {
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
    return [ballVector[0], -ballVector[1]];
  }
}

export function getFreshBoard(): number[][] {
  return Array(10)
    .fill(0)
    .map(() => Array(10).fill(1));
}

export function getStartBricks() {
  const bricks: Brick[] = [];
  Array(10)
    .fill(0)
    .map(() => Array(10).fill(0))
    .map((x, i) => {
      x.map((y, j) => {
        bricks.push({
          tlX: i * 50,
          tlY: 10 * j,
          brX: i * 50 + 50,
          brY: 10 * j + 10,
        });
      });
    });
  return bricks;
}
