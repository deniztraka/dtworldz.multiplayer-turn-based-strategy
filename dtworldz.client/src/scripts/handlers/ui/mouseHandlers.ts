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

            //console.log(MathUtils.getDistanceBetweenPoints({ x: pointer.worldX, y: pointer.worldY }, { x: this.game.localPlayer.container.x, y: this.game.localPlayer.container.y })    );

            this.game.soundManager.play('attack', pointer.worldX, pointer.worldY - 32, 10000, 1);

            // this.game.sound.play('attack', {
            //     mute: false,
            //     volume: 1,
            //     rate: 1,
            //     detune: 0,
            //     seek: 0,
            //     loop: false,
            //     delay: 0,
            //     // source of the spatial sound
            //     source: {
            //         x: pointer.worldX,
            //         y: pointer.worldY - 32,
            //         z: 0,
            //         panningModel: 'equalpower',
            //         distanceModel: 'inverse',
            //         orientationX: 0,
            //         orientationY: 0,
            //         orientationZ: -1,
            //         refDistance: 1,
            //         maxDistance: 10000,
            //         rolloffFactor: 1,
            //         coneInnerAngle: 360,
            //         coneOuterAngle: 0,
            //         coneOuterGain: 0,
            //         follow: undefined
            //     }
            // });


            const { worldX, worldY } = pointer
            var tile = this.game.floorLayer.getIsoTileAtWorldXY(worldX , worldY - 32);
            if (tile) {
                this.eventEmitter.emit('tileClick', tile);
            } else {
                this.game.localPlayer.setSelectedTile(null);
                this.game.localPlayer.clearPath();
                this.game.localPlayer.clearActions();
            }
        })
    }

    onTileClick(tile: Phaser.Tilemaps.Tile) {
        if(this.game.localPlayer && this.game.localPlayer.client.isDead){
            return;
        }

        if(!this.game.isGameStarted){
            return;
        }

        const alreadySelectedTile = this.game.localPlayer.getSelectedTile();
        this.game.localPlayer.setSelectedTile(tile);

        const tilePos = { x: tile.x, y: tile.y };

        // there is no previously selected tile, request path for selected tile
        if (!alreadySelectedTile) {
            this.game.room.send('ca_action', { aid: 'select-tile', payload: tilePos});
            return;
        }

        // same tile is selected, clear selection
        if (alreadySelectedTile.x === tile.x && alreadySelectedTile.y === tile.y) {
            this.game.localPlayer.setSelectedTile(null);
            this.game.localPlayer.clearPath();
            this.game.localPlayer.clearActions();
            return;
        }

        // new tile is selected so request path
        this.game.room.send('ca_action', { aid: 'select-tile', payload: tilePos});
    }
}