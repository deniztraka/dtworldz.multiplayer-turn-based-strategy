import Phaser from "phaser";
import characterPanelUrl from "./../../public/assets/images/characterPanel.png"
import { GameScene } from "./GameSceneOld";

export class UIScene extends Phaser.Scene {
    gameScene: GameScene;

    constructor() {
        super({ key: "UIScene"});
    }

    init(data: {}) {

    }

    preload() {
        this.load.image('charPanel', characterPanelUrl);
        this.gameScene = this.scene.get('GameScene') as GameScene;
       

    }


    async create() {
        this.add.image(0, 0, 'charPanel').setOrigin(0, 0);
        this.gameScene.events.on('characterInitialized', () => {
            let name = this.gameScene.currentPlayer.playerName;
            this.add.text(70, 147, name, { color: "#dddddd", fontSize: "16px", fontFamily: 'Arial',fixedWidth:120, align:"center", padding: { left: 0, right: 0, top: 5, bottom: 5, } }).setOrigin(0.5, 0);
        });
    }


    update(time: number, delta: number): void {


    }

    fixedTick(_time: any, _delta: any) {

    }
}