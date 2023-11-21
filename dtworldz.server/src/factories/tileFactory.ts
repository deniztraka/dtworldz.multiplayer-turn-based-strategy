import { ForestTile } from "../models/tilemap/tiles/forestTile";
import { MountainsTile } from "../models/tilemap/tiles/mountainsTile";
import { PlainsTile } from "../models/tilemap/tiles/plainsTile";
import { WaterTile } from "../models/tilemap/tiles/waterTile";
import { BaseTile } from "../schema/tilemap/tile/baseTile";
export class TileFactory {
    static createTile(index: number): BaseTile {
        switch (index) {
            case 0:
                return new WaterTile();
            case 1:
                return new PlainsTile();
            case 2:
                return new ForestTile();
            case 3:
                return new MountainsTile();
            default:
                console.log('TileFactory: createTile: index not found: ' + index);
                break;
        }
    }
}