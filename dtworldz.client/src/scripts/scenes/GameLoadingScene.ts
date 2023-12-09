import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from '../utils/ui/textStyles';

export class GameLoadingScene extends Phaser.Scene {
    room: Room | undefined;
    clients: { [sessionId: string]: any } = {};
    titleText: DTLabel;
    brandText: DTLabel;
    subTitleText: DTLabel;
    loadingMessage: DTLabel;
    localClient: any;
    gameRunningScene: Phaser.Scene;

    constructor() {
        super({ key: "GameLoadingScene" })

    }

    init(data: { room: Room, clients: { [sessionId: string]: any } }) {

        this.room = data.room;
        this.clients = data.clients;
        this.setLocalClient(this.clients);
    }
    setLocalClient(clients: { [sessionId: string]: any; }): any {
        for (const sessionId in clients) {
            if (Object.prototype.hasOwnProperty.call(clients, sessionId)) {
                const client = clients[sessionId];
                if (this.room.sessionId === sessionId) {
                    this.localClient = client;
                }
            }
        }
    }

    preload() {
        this.load.spritesheet('tileComponents', '/assets/images/tilemaps/tileComponents.png', { frameWidth: 60, frameHeight: 60 });
        this.load.image('plainTiles', '/assets/images/tilemaps/plainsTiles.png');
        this.load.image('marker', '/assets/images/tilemaps/marker.png');
        this.load.image('target', '/assets/images/tilemaps/target.png');
        this.load.spritesheet('playerStatusIcons', '/assets/images/playerStatusIcons.png', { frameWidth: 60, frameHeight: 60 });
        this.load.spritesheet('actionIcons', '/assets/images/actionIcons.png', { frameWidth: 60, frameHeight: 60 });
        this.load.image('graveStone', '/assets/images/graveStone.png');
    }

    create() {
        this.loadingUI();
        this.attachRoomEvents();
        this.gameRunningScene = this.scene.get('GameIsRunningScene');
    }

    attachRoomEvents() {

        this.room.onMessage("loadingGame", (payload) => {
            this.loadingMessage.setText(payload.message + " (" + payload.progress + "%)");
        });

        this.room.onMessage("gameIsRunning", (payload) => {
            this.scene.start('GameIsRunningScene', { room: this.room, clients: this.clients, localClient: this.localClient });
        });

        this.room.state.tilemap.onAdd((tile: any, key: any) => {
            tile.components.onChange((change: any, key:string) => {
                this.gameRunningScene.events.emit('tile-component-changed', {tile: tile, key: key, change: change});
            });
        });

        // TODO: think about what to do if a player is removed on loading screen.
        // because this triggers also when a player is removed from the room on running screen
        // this.room.state.players.onRemove((_client: any, sessionId: any) => {
        //     console.log(`${sessionId} is removed`);
        //     const client = this.clients[sessionId]

        //     if (client) {
        //         delete this.clients[sessionId]
        //     }
        // });
    }

    loadingUI() {
        const scene: any = this;
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5)

        this.loadingMessage = new DTLabel(this, this.scale.width / 2, this.scale.height / 2, "creating the world..")
        this.add.existing(this.loadingMessage);
    }

}