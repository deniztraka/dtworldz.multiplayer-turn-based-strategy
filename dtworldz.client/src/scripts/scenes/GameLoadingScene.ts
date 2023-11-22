import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from '../utils/ui/textStyles';
import tileAtlasUrl from "../../../assets/images/tilemaps/newworldtiles.png"
import plainTilesUrl from "../../../assets/images/tilemaps/plainsTiles.png"

export class GameLoadingScene extends Phaser.Scene {
    room: Room | undefined;
    clients: { [sessionId: string]: any } = {};
    titleText: DTLabel;
    brandText: DTLabel;
    subTitleText: DTLabel;
    loadingMessage: DTLabel;

    constructor() {
        super({ key: "GameLoadingScene" })

    }

    init(data: { room: Room, clients: { [sessionId: string]: any } }) {

        this.room = data.room;
        this.clients = data.clients;
    }

    preload() {
        this.load.image('tileAtlas', tileAtlasUrl);
        this.load.image('plainTiles', plainTilesUrl);
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
            this.scene.start('GameIsRunningScene', { room: this.room, clients: this.clients });
        });

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((_client: any, sessionId: any) => {
            console.log(`${sessionId} is removed`);
            const client = this.clients[sessionId]

            if (client) {
                delete this.clients[sessionId]
            }
        });
    }

    loadingUI() {

        let scene: any = this;

        /** General UI Branding Starts **/
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5)
            .setTint(0x333333)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.titleText = new DTLabel(this, this.scale.width / 2, 50, "Exiles of Lowlands").setStyle(TextStyles.H1).setColor("#E8D9A1");
        this.subTitleText = new DTLabel(this, this.scale.width / 2, 110, "The Darkening Mists").setStyle(TextStyles.H4).setColor("#B4AA83");
        this.brandText = new DTLabel(this, this.scale.width / 2, this.scale.height - 25, "DTWorldz").setStyle(TextStyles.H4).setColor("#E8D9A1").setAlpha(0.25);
        this.add.existing(this.titleText);
        this.add.existing(this.subTitleText);
        this.add.existing(this.brandText);
        /** General UI Branding Ends **/

        this.loadingMessage = new DTLabel(this, this.scale.width / 2, this.scale.height / 2, "creating the world..").setStyle(TextStyles.BodyText).setColor("#E8D9A1").setAlpha(0.5);
        this.add.existing(this.loadingMessage);
    }

}