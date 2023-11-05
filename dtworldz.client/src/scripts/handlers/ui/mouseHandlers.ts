import { GameScene } from "../../scenes/GameScene";
import { ClientEvents, Commands } from "dtworldz.shared-lib"

export class MouseHandler {

    game: GameScene
    eventEmitter: Phaser.Events.EventEmitter
    constructor(game: GameScene) {
        this.game = game
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.eventEmitter.on('tileClick', this.onTileClick, this);
    }

    attachEvents() {
        this.game.input.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
            const { worldX, worldY } = pointer
            var tile = this.game.worldMap.floorLayer.getIsoTileAtWorldXY(worldX, worldY);
            if (tile) {
                this.eventEmitter.emit('tileClick', tile);
            }
        })
    }

    onTileClick(tile: Phaser.Tilemaps.Tile) {
        this.game.room.send(ClientEvents.Input, {id: 0, tick: this.game.currentTick, payload: { x: tile.x, y: tile.y }})
        // this.game.worldMap.pathfinder.find(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(tile.x, tile.y), function (path: { x: number; y: number; }[]) {
        //     console.log(path);
        // })
    }
}