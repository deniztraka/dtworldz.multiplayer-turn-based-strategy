import { GameIsRunningScene } from "../../scenes/GameIsRunningScene";

export class MouseHandler {

    game: GameIsRunningScene
    eventEmitter: Phaser.Events.EventEmitter
    constructor(game: GameIsRunningScene) {
        this.game = game
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.eventEmitter.on('tileClick', this.onTileClick, this);
    }

    init() {
        this.game.input.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
            const { worldX, worldY } = pointer
            var tile = this.game.floorLayer.getIsoTileAtWorldXY(worldX , worldY - 16);
            if (tile) {
                this.eventEmitter.emit('tileClick', tile);
            } else {
                this.game.localPlayer.setSelectedTile(null);
            }
        })
    }

    onTileClick(tile: Phaser.Tilemaps.Tile) {
        const alreadySelectedTile = this.game.localPlayer.getSelectedTile();
        this.game.localPlayer.setSelectedTile(tile);

        const tilePos = { x: tile.x, y: tile.y };

        // there is no previously selected tile, request path for selected tile
        if (!alreadySelectedTile) {
            this.game.room.send('ca_action', { aid: 'select-tile', payload: tilePos});
            return;
        }

        // same tile is selected so request move
        if (alreadySelectedTile.x === tile.x && alreadySelectedTile.y === tile.y) {
            this.game.room.send('ca_action', { aid: 'move', payload: tilePos});
            this.game.localPlayer.setSelectedTile(null);
            // new tile is selected so request path
        } else {
            this.game.room.send('ca_action', { aid: 'select-tile', payload: tilePos});
        }
    }
}