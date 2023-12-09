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
        const nameOffset = Math.floor(Math.random() * 10) - 50;

        const characterSprite = (scene.add as any).sprite(0, 0 + this.offSetY, 'char' + client.charIndex).setOrigin(0.5, 1).setTint(0xcccccc).setScale(0.75);
        const flipIndex = [4,1];
        characterSprite.flipX = flipIndex.indexOf(client.charIndex) > -1;

        const playerNameText = (scene.add as any).text(0, -160 + this.offSetY + nameOffset, client.name, {
            fontFamily: 'Arial',
            fontSize: '20px',
            align: 'center',
            fixedWidth: 0,
            fixedHeight: 0,
            padding: {
                left: 40,
                right: 40,
                top: 5,
                bottom: 5,
            }
        }).setOrigin(0.5, 0.5).setColor("#fff").setAlpha(1).setScale(1);
        const readyImage = (scene.add as any).image(0, 20 + this.offSetY, client.isReady ? 'ready' : 'notready').setDisplaySize(25, 25).setAlpha(0.75);
        this.add(playerNameText);
        this.add(characterSprite);
        this.add(readyImage);

        scene.add.existing(this);
    }
}