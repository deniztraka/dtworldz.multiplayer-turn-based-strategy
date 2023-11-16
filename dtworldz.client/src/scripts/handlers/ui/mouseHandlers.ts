import { GameScene } from "../../scenes/GameSceneOld";
import { ClientEvents } from "dtworldz.shared-lib"
import { CmdPayloadMoveToTile, CmdPayloadTileSelected } from "dtworldz.shared-lib";

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
            var tile = this.game.worldMap.floorLayer.getIsoTileAtWorldXY(worldX , worldY - 32);
            if (tile) {
                this.eventEmitter.emit('tileClick', tile);
            } else {
                this.game.currentPlayer.setSelectedTile(null);
            }
        })
    }

    onTileClick(tile: Phaser.Tilemaps.Tile) {
        const alreadySelectedTile = this.game.currentPlayer.getSelectedTile();
        this.game.currentPlayer.setSelectedTile(tile);

        // prevent sending commands if it is not current player's turn
        // if(this.game.currentTurnSessionId !== this.game.currentPlayer.sessionId){
        //     return;
        // }

        const tileSelectedCommandPayload = new CmdPayloadTileSelected(this.game.currentTick, { x: tile.x, y: tile.y });

        // there is no previously selected tile, request path for selected tile
        if (!alreadySelectedTile) {
            this.game.room.send(ClientEvents.Input, tileSelectedCommandPayload);
            return;
        }

        // same tile is selected so request move
        if (alreadySelectedTile.x === tile.x && alreadySelectedTile.y === tile.y) {
            this.game.room.send(ClientEvents.Input, new CmdPayloadMoveToTile(this.game.currentTick, { x: tile.x, y: tile.y }));
            this.game.currentPlayer.setSelectedTile(null);
            // new tile is selected so request path
        } else {
            this.game.room.send(ClientEvents.Input, tileSelectedCommandPayload);
        }
    }
}