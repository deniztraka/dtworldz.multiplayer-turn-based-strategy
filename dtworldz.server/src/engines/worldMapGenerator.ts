import { TileFactory } from "../factories/tileFactory";
import { ForestTile } from "../models/tilemap/tiles/forestTile";
import { MountainsTile } from "../models/tilemap/tiles/mountainsTile";
import { PlainsTile } from "../models/tilemap/tiles/plainsTile";
import { WaterTile } from "../models/tilemap/tiles/waterTile";
import { BaseTile } from "../schema/tilemap/tile/baseTile";

const dataIndex = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 2, 2, 1, 1, 1, 0, 0, 0],
    [0, 1, 2, 3, 2, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 3, 0, 0, 0],
    [0, 0, 2, 3, 0, 3, 3, 1, 1, 0],
    [0, 0, 2, 0, 0, 1, 3, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

export class WorldMapGenerator {
   
    data : BaseTile[][];
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = [];
    }

    generate() {
        for (let x = 0; x < this.width; x++) {
            this.data[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.data[x][y] = TileFactory.createTile(dataIndex[x][y]);
            }
        }

        return this.data;
    }
}