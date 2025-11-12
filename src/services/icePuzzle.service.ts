interface Point {
  x: number;
  y: number;
}

export enum Tile {
  Ice,
  Rock,
  Goal,
  Start,
}

export class IcePuzzleGenerator {
  width: number;
  height: number;
  directionIndex: number;
  board: number[][];
  pathDirectionIndices: number[];
  start: Point;
  end: Point;
  current: Point;

  constructor() {
    this.width = 0;
    this.height = 0;
    this.directionIndex = 0;
    this.board = [];
    this.pathDirectionIndices = [];
    this.start = { x: 0, y: 0 };
    this.end = { x: 0, y: 0 };
    this.current = { x: 0, y: 0 };
  }

  Generate(width: number, height: number, bypassTimeout: boolean) {
    const start = performance.now();
    this.width = width;
    this.height = height;

    let o = false;
    let attempts = 0;
    const perf: number[] = [];
    while (!o && (performance.now() - start < 30000 || bypassTimeout)) {
      const loopStart = performance.now();
      this.board = Array(this.width + 2)
        .fill(null)
        .map(() => Array(this.height + 2).fill(0));

      for (let i = 0; i < this.board.length; i++) {
        this.board[i][0] = 2;
        this.board[i][this.board[0].length - 1] = 2;
      }
      for (let j = 1; j < this.board[0].length - 1; j++) {
        this.board[0][j] = 2;
        this.board[this.board.length - 1][j] = 2;
      }

      this.start.x = 0;
      this.start.y = 0;
      const randomPerimeterDistance = Math.floor(Math.random() * (this.width * 2 + this.height * 2));
      if (randomPerimeterDistance < this.width * 2) {
        this.start.x = (randomPerimeterDistance % this.width) + 1;
        this.start.y = randomPerimeterDistance < this.width ? 0 : this.height + 1;
      } else {
        this.start.y = ((randomPerimeterDistance - this.width * 2) % this.height) + 1;
        this.start.x = randomPerimeterDistance - this.width * 2 < this.height ? 0 : this.width + 1;
      }
      if (this.start.x < 1) {
        this.directionIndex = 3;
      } else if (this.start.x > this.width) {
        this.directionIndex = 1;
      } else if (this.start.y < 1) {
        this.directionIndex = 2;
      } else if (this.start.y > this.height) {
        this.directionIndex = 0;
      }

      this.board[this.start.x][this.start.y] = 0;
      this.current = { ...this.start };
      this.pathDirectionIndices = [];
      this.pathDirectionIndices.push(this.directionIndex);

      for (let i = 0; i++ < Math.min(this.width, this.height) - 1; ) {
        if (!this.nextPoint()) break;
      }
      o =
        this.pathDirectionIndices.length >= Math.min(this.width, this.height) - 1 &&
        this.F() &&
        this.V() === this.pathDirectionIndices.length;
      attempts++;
      perf.push(performance.now() - loopStart);
    }
    console.log(perf.reduce((p, c) => p + c, 0) / perf.length);

    const tempBoard: Tile[][] = Array(this.width + 2)
      .fill(null)
      .map(() => Array(this.height + 2).fill(Tile.Rock));

    for (let j = 1; j < this.height + 1; j++) {
      for (let i = 1; i < this.width + 1; i++) {
        tempBoard[i][j] = this.board[i][j] > 0 ? Tile.Rock : Tile.Ice;
      }
    }

    const finalBoard = tempBoard[0]
      .map((_val, index) => tempBoard.map((row) => row[index]).reverse())
      .map(function (arr) {
        return arr.reverse();
      });

    finalBoard[this.start.y][this.start.x] = Tile.Start;

    finalBoard[this.end.y][this.end.x] = Tile.Goal;

    const dirs = ["U", "L", "D", "R"];
    const solutionString = this.pathDirectionIndices.map((e) => dirs[e]).join("");
    return {
      solutionString,
      board: finalBoard,
      start: this.start,
      timeTaken: (performance.now() - start).toFixed(2),
      attempts,
    };
  }

  F(): boolean {
    let c = 0;
    while (this.C() < 1 && c++ < 10) {
      if (!this.nextPoint()) return false;
    }
    return true;
  }

  C() {
    let d = this.directionIndex < 2 ? -1 : 1;
    if (this.directionIndex % 2 < 1) {
      let y = this.current.y;
      while (y > 0 && y < this.height + 1) {
        y += d;
        if (this.board[this.current.x][y] === 1) {
          return 0;
        }
      }
      this.end = { x: this.current.x, y };
    } else {
      let x = this.current.x;
      while (x > 0 && x < this.width + 1) {
        x += d;
        if (this.board[x][this.current.y] === 1) {
          return 0;
        }
      }
      this.end = { x, y: this.current.y };
    }
    this.board[this.end.x][this.end.y] = 0;
    return 1;
  }

  V() {
    if (this.start.x - this.end.x + (this.start.y - this.end.y) < 2) {
      return 0;
    }
    let pointQueue: Point[] = [];
    let d: number[] = [];
    this.board[this.start.x][this.start.y] = -2;

    pointQueue.push(this.start);
    d.push(0);
    while (pointQueue.length > 0) {
      let t = pointQueue.shift()!;
      let h = d.shift()!;
      if (t.x === this.end.x && t.y === this.end.y) {
        return h;
      }
      for (let i = 0; i < 4; i++) {
        let n = this.getNewPoint(t, i < 2 ? 0 : 1, i % 2 < 1 ? -1 : 1, 99, false);
        if (this.board[n.x][n.y] === -2) continue;
        this.board[n.x][n.y] = -2;
        pointQueue.push(n);
        d.push(h + 1);
      }
    }
    return 0;
  }

  nextPoint(): boolean {
    let d: -1 | 1 = this.directionIndex < 2 ? -1 : 1;

    const nextPoint = this.getNewPoint(
      this.current,
      this.directionIndex,
      d,
      Math.floor((Math.random() * (this.directionIndex % 2 < 1 ? this.height : this.width)) / 2) + 2,
      true
    );
    if (
      nextPoint.x < 1 ||
      nextPoint.y < 1 ||
      nextPoint.x > this.width ||
      nextPoint.y > this.height ||
      (nextPoint.x === this.current.x && nextPoint.y === this.current.y) ||
      this.board[nextPoint.x][nextPoint.y] != 0
    ) {
      return false;
    }
    let x = nextPoint.x;
    let y = nextPoint.y;

    if (this.directionIndex % 2 < 1) {
      y += d;
    } else {
      x += d;
    }

    if (this.board[x][y] < 0) {
      return false;
    }
    this.board[nextPoint.x][nextPoint.y] = -1;
    this.board[x][y] = 1;
    let f = Math.floor(Math.random() * 2) < 1 ? -1 : 1;
    this.directionIndex = this.directionIndex % 2 < 1 ? (f < 0 ? 1 : 3) : (this.directionIndex = f < 0 ? 0 : 2);
    this.current = nextPoint;

    this.pathDirectionIndices.push(this.directionIndex);
    return true;
  }

  getNewPoint(currentPoint: Point, direction: number, d: -1 | 1, distance: number, s: boolean): Point {
    let i = 1,
      x = currentPoint.x,
      y = currentPoint.y;
    for (; i <= distance; i++) {
      if (direction % 2 < 1) {
        y = currentPoint.y + i * d;
      } else {
        x = currentPoint.x + i * d;
      }
      if (this.end.x === x && this.end.y === y) {
        return this.end;
      }
      if (y < 0 || y > this.height + 1 || x < 0 || x > this.width + 1) {
        return currentPoint;
      }
      if (s && this.board[x][y] < 1) {
        this.board[x][y] = -1;
      }
      if (this.board[x][y] > 0) {
        if (direction % 2 < 1) {
          y -= d;
        } else {
          x -= d;
        }
        return { x, y };
      }
    }
    if (direction % 2 < 1) {
      return { x: currentPoint.x, y: currentPoint.y + i * d };
    } else {
      return { x: currentPoint.x + i * d, y: currentPoint.y };
    }
  }
}
