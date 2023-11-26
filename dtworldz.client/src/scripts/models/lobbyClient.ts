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
        this.offSetY = 0;
        const nameOffset = Math.floor(Math.random() * 25) - 10;

        const characterSprite = (scene.add as any).sprite(0, 0 + this.offSetY, 'char' + client.charIndex).setOrigin(0.5, 1).setDisplaySize(125, 125).setTint(0xcccccc);
        const flipIndex = [4,1];
        characterSprite.flipX = flipIndex.indexOf(client.charIndex) > -1;

        const playerNameText = (scene.add as any).text(0, -150 + this.offSetY + nameOffset, client.name, textStyles.BodyText).setOrigin(0.5, 0.5).setColor("#eeefbf").setAlpha(0.9);
        const readyImage = (scene.add as any).image(25, -10 + this.offSetY, client.isReady ? 'ready' : 'notready').setDisplaySize(15, 15).setAlpha(1);
        this.add(playerNameText);
        this.add(characterSprite);
        this.add(readyImage);

        scene.add.existing(this);
    }
}