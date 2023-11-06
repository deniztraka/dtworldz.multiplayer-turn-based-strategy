import { GameScene } from "../../scenes/GameScene";
import { ClientEvents, Commands } from "dtworldz.shared-lib"
import { BaseCommandPayload } from "dtworldz.shared-lib";

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
            } else {
                this.game.currentPlayer.setSelectedTile(null);
            }
        })
    }

    onTileClick(tile: Phaser.Tilemaps.Tile) {
        var alreadySelectedTile = this.game.currentPlayer.getSelectedTile();
        this.game.currentPlayer.setSelectedTile(tile);

        // there is no previously selected tile, request path for selected tile
        if(!alreadySelectedTile){
            this.game.room.send(ClientEvents.Input, { id: Commands.TileSelected, tick: this.game.currentTick, payload: { x: tile.x, y: tile.y } })
            return;
        }

        // same tile is selected so request move
        if (alreadySelectedTile.x == tile.x && alreadySelectedTile.y == tile.y) {
            this.game.room.send(ClientEvents.Input, { id: Commands.MoveToTile, tick: this.game.currentTick, payload: { x: tile.x, y: tile.y } })
            this.game.currentPlayer.setSelectedTile(null);

        // new tile is selected so request path
        } else {
            this.game.room.send(ClientEvents.Input, { id: Commands.TileSelected, tick: this.game.currentTick, payload: { x: tile.x, y: tile.y } })
        }







        // this.game.worldMap.pathfinder.find(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(tile.x, tile.y), function (path: { x: number; y: number; }[]) {
        //     console.log(path);
        // })
    }
}