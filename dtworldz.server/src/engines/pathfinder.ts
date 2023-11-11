import * as easystarjs from 'easystarjs';

interface Point {
    x: number;
    y: number;
}

class Pathfinder {
  private easystar: easystarjs.js;
  constructor(grid: number[][]) {
    this.easystar = new easystarjs.js();
    this.easystar.enableDiagonals();
    this.easystar.disableCornerCutting();
    this.easystar.setGrid(grid);
    this.easystar.setAcceptableTiles([10, 11, 12, 13, 14, 15, 16]);
  }

  public findPath(startX: number, startY: number, endX: number, endY: number): Promise<{path: Point[]}> {
    return new Promise((resolve, reject) => {
      this.easystar.findPath(startX, startY, endX, endY, (path: Point[]) => {
        if (path === null) {
          reject(new Error('No path found'));
        } else {
          resolve({ path });
        }
      });
      this.easystar.calculate();
    });
  }
}

export { Pathfinder };