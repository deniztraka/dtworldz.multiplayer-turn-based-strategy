import { Biomes } from "./Biomes";
import { PlainsTile } from "./plainsTile";
import { Position } from "../../../schema/position";
import { BaseTile } from "../../../schema/tilemap/tile/baseTile";
export class TileFactory {
    static createTile(pos:Position, biome: Biomes ): BaseTile {
        switch (biome) {
            case 1:
                return new PlainsTile(pos);
            default:
                console.log('TileFactory: createTile: biome not found: ' + biome);
                break;
        }
    }
}