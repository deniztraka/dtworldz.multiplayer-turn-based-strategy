import EasyStar from 'easystarjs';
import { Position } from '../../schema/position';
import { BaseMobile } from '../../schema/mobiles/baseMobile';
import { TraitsEngine } from '../traitSystem/traitsEngine';
import { WorldRoom } from '../../rooms/dtWorldz';

export class DynamicPathfindingService {
    private easystar = new EasyStar.js();
    worldRoom: WorldRoom;
    mobile: BaseMobile;

    constructor(worldRoom: WorldRoom, mobile: BaseMobile) {
        this.worldRoom = worldRoom;
        this.mobile = mobile;
        this.init();
        this.easystar.enableDiagonals();
        this.easystar.enableCornerCutting();
    }

    private init(){
        // prepare 2d grid with ids of tiles
        let grid: number[][] = [];
        for (let y = 0; y < this.worldRoom.state.height; y++) {
            grid[y] = [];
            for (let x = 0; x < this.worldRoom.state.width; x++) {
                grid[y][x] = this.worldRoom.state.tilemap[y * this.worldRoom.state.width + x].nature;
            }
        }
        this.easystar.setGrid(grid);

        // prepare walkable data
        let walkableData: number[] = [];
        this.worldRoom.state.tilemap.forEach(tile => {
            if(tile.canMove(this.mobile)){
                walkableData.push(tile.nature);
            }
        });

        this.easystar.setAcceptableTiles(walkableData);

        // avoid player collisions
        this.worldRoom.state.players.forEach(player => {
            if(this.mobile.sessionId !== player.sessionId){
                this.easystar.avoidAdditionalPoint(player.position.x, player.position.y);
            }
        });
    }

    async findPathForPlayer(start: Position, end: Position, player: BaseMobile): Promise<Position[]> {
        return new Promise((resolve, reject) => {
            try {
                this.easystar.findPath(start.x, start.y, end.x, end.y, (path) => {
                    if (path === null) {
                        resolve([]);
                    } else {
                        resolve(path.map(p => new Position(p.x, p.y)));
                    }
                });
                this.easystar.calculate();
            } catch (error) {
                console.error('Error in pathfinding service:', error);
                reject(error);
            }
        });
    }
}