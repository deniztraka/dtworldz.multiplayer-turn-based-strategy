import { StandardMovement } from "../models/tilemap/strategies/movement/standartMovement";
import { BaseTile } from "../schema/tilemap/tile/baseTile";
import { RestrictedMovement } from "../models/tilemap/strategies/movement/restrictedMovement";
import { ImpossibleMovement } from "../models/tilemap/strategies/movement/impossibleMovement";

export class TileFactory {
    static createTile(type: string) {
        const strategies: {[key: string]: StandardMovement | RestrictedMovement | ImpossibleMovement} = {
            'Plain': new StandardMovement(),
            'Forest': new StandardMovement(),
            'Mountain': new RestrictedMovement(),
            'Sea': new ImpossibleMovement()
        };

        const ids : {[key: string]: number} = {
            'Plain': 0,
            'Forest': 1,
            'Mountain': 2,
            'Sea': 3,
        };

        return new BaseTile(ids[type], type, strategies[type]);
    }
}