import Phaser from "phaser";
import heroImageUrl from "./../../public/assets/images/hero.png"

export class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: "selector", active: true });
    }

    preload() {
        // update menu background color
        this.cameras.main.setBackgroundColor(0x000000);

        // preload demo assets
        this.load.image('heroImage', heroImageUrl);
        // this.load.image('ship_0001', 'https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png?v=1649945243288');
    }

    create() {
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            color: "#ff0000",
            fontSize: "32px",
            // fontSize: "24px",
            fontFamily: "Arial"
        };

        this.add.text(130, 150 , "Join in", textStyle)
                .setInteractive()
                .setPadding(6)
                .on("pointerdown", () => {
                    this.scene.start('GameScene');
                })
    }
}