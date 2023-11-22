import { Biomes } from "../models/tilemap/tiles/Biomes";
import { PlainsTile } from "../models/tilemap/tiles/plainsTile";
import { BaseTile } from "../schema/tilemap/tile/baseTile";
export class TileFactory {
    static createTile(biome: Biomes): BaseTile {
        switch (biome) {
            case 1:
                return new PlainsTile();
            default:
                console.log('TileFactory: createTile: biome not found: ' + biome);
                break;
        }
    }
}