import easystarjs from 'easystarjs'

export class PathFinder {
    #easystarjs: easystarjs.js
    constructor(grid: number[][]) {
        this.#easystarjs = new easystarjs.js()
        this.#easystarjs.setGrid(grid);
        this.#easystarjs.setAcceptableTiles([10, 11, 12, 13, 14, 15, 16]);
        this.#easystarjs.enableDiagonals();
    }

    find(startingPoint: Phaser.Math.Vector2, targetPoint: Phaser.Math.Vector2, callback: (path: { x: number; y: number; }[]) => any): void {
        this.#easystarjs.findPath(startingPoint.x, startingPoint.y, targetPoint.x, targetPoint.y, callback);
        this.#easystarjs.calculate();
    }
}