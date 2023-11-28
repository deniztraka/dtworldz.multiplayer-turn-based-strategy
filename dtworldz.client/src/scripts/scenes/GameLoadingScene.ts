import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from '../utils/ui/textStyles';
import plainTilesUrl from "../../../assets/images/tilemaps/plainsTiles.png"
import markerUrl from "../../../assets/images/tilemaps/marker.png"
import { GameIsRunningScene } from "./GameIsRunningScene";

export class GameLoadingScene extends Phaser.Scene {
    room: Room | undefined;
    clients: { [sessionId: string]: any } = {};
    titleText: DTLabel;
    brandText: DTLabel;
    subTitleText: DTLabel;
    loadingMessage: DTLabel;
    localClient: any;

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
        this.load.image('plainTiles', '/assets/images/tilemaps/plainsTiles.png');
        this.load.image('markerImage', '/assets/images/tilemaps/marker.png');
    }

    create() {
        this.loadingUI();
        this.attachRoomEvents();
    }

    attachRoomEvents() {

        this.room.onMessage("loadingGame", (payload) => {
            this.loadingMessage.setText(payload.message + " (" + payload.progress + "%)");
        });

        this.room.onMessage("gameIsRunning", (payload) => {
            this.scene.start('GameIsRunningScene', { room: this.room, clients: this.clients, localClient: this.localClient });
        });

        // // remove local reference when entity is removed from the server
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
        this.add.image(this.scale.width / 2, 0, 'logo')
            .setOrigin(0.5, 0)

        this.loadingMessage = new DTLabel(this, this.scale.width / 2, this.scale.height / 2, "creating the world..").setStyle(TextStyles.BodyText).setColor("#E8D9A1").setAlpha(1);
        this.add.existing(this.loadingMessage);
    }

}