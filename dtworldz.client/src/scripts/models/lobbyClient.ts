import { Game, Scene } from "phaser";
import { IPoint } from "../interfaces/ipoint";
import textStyles from "../utils/ui/textStyles";
import Button from "phaser3-rex-plugins/plugins/button";
import { LobbyScene } from "../scenes/LobbyScene";

export class LobbyClient extends Phaser.GameObjects.Container {

    client: any;
    sessionId: any;
    playerName: any;
    offSetY: number;
    constructor(scene: LobbyScene, client: any, x: number, y: number) {
        super(scene, x, y, null);
        this.client = client;
        this.offSetY = 100;

        let characterSprite = (scene.add as any).sprite(0, 0 + this.offSetY, 'hero' + client.charIndex).setOrigin(0.5, 0.7);
        let playerNameText = (scene.add as any).text(5, 20 + this.offSetY, client.name, textStyles.BodyText).setOrigin(0.5, 0.5).setColor("#cccccc").setAlpha(0.75);
        let readyImage = (scene.add as any).image(25, -10 + this.offSetY, client.isReady ? 'ready' : 'notready').setDisplaySize(15, 15).setAlpha(0.75);
        this.add(playerNameText);
        this.add(characterSprite);
        this.add(readyImage);

        scene.add.existing(this);
    }
}