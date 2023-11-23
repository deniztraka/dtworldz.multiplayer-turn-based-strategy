import EasyStar from 'easystarjs';
import { Position } from '../../schema/position';
import { BaseMobile } from '../../schema/mobiles/baseMobile';
import { TraitsEngine } from '../traitSystem/traitsEngine';
import { WorldRoom } from '../../rooms/dtWorldz';

export class DynamicPathfindingService {
    private easystar = new EasyStar.js();

    constructor(worldRoom: WorldRoom) {
        this.easystar.setGrid([/* default grid */]);//todo: implement converting tiles into grid
        this.easystar.setAcceptableTiles([/* default walkable tiles */]);
    }

    async findPathForPlayer(start: Position, end: Position, player: BaseMobile): Promise<Position[]> {
        this.configureWalkableTiles(player);


        return new Promise((resolve, reject) => {
            try {




                this.easystar.findPath(start.x, start.y, end.x, end.y, (path) => {

                    console.log("patfinding works")
                    if (path === null) {
                        reject('Path not found');
                    } else {
                        resolve(path.map(p => new Position(p.x, p.y)));
                    }
                });
                this.easystar.calculate();
            } catch (error) {
                console.error('Error in pathfinding:', error);
                reject(error);
            }
        });
    }

    private configureWalkableTiles(player: BaseMobile) {
        //todo: implement this walkable tiles for player


        // Adjust walkable tiles based on player's attributes and traits
        const walkableTiles: number[] = [1/* default walkable tiles */];

        // // find index of each position player can move to
        // // if player has climbing trait, add mountain tiles to walkable tiles
        // // if player has flying trait, add all tiles to walkable tiles
        // // if player has swimming trait, add water tiles to walkable tiles

        // const hasClimbingTrait = TraitsEngine.hasTrait(player, 'climbing');
        // const hasFlyingTrait = TraitsEngine.hasTrait(player, 'flying');
        // const hasSwimmingTrait = TraitsEngine.hasTrait(player, 'swimming');

        // if (hasClimbingTrait) {
        //     walkableTiles.push(/* mountain tile id, if applicable */);
        // }

        // if (hasFlyingTrait) {
        //     // Add all tiles to walkable tiles
        //     // Iterate through tileData and add all tile ids to walkableTiles
        // }

        // if (hasSwimmingTrait) {
        //     // Add water tiles to walkable tiles
        //     // Iterate through tileData and add water tile ids to walkableTiles
        // }

        // Set the updated walkable tiles
        this.easystar.setAcceptableTiles(walkableTiles);
    }
}