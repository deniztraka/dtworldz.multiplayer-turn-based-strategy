import Phaser from "phaser";
import heroImageUrl from "../../../assets/images/characters/hero1.png"
import tileAtlasUrl from "../../../assets/images/tilemaps/tileatlas.png"
import markerUrl from "../../../assets/images/tilemaps/marker.png"
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';
import Button from 'phaser3-rex-plugins/plugins/button.js';

export class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: "selector"});
    }

    preload() {
        // update menu background color
        this.cameras.main.setBackgroundColor(0x000000);

        // preload
        this.load.image('heroImage', heroImageUrl);
        this.load.image('markerImage', markerUrl);
        this.load.image('tileAtlas', tileAtlasUrl)
        
    }

    create() {
        var inputText = new InputText(this, this.scale.width/2, this.scale.height/2, 150, 50, {
            type: 'text',
            text: '',
            fontSize: '24px',
            color: '#000000',
            backgroundColor: '#cccccc',
            align: 'center',
            border: 3,
            placeholder: 'your name?',
            fontFamily: 'Arial',
        });
        this.add.existing(inputText);

        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            color: "#000000",
            fontSize: "32px",
            fontFamily: 'Arial',
            backgroundColor: "#ffffff",
            padding: {
                left: 40,
                right: 40,
                top: 5,
                bottom: 5,
            }
        };

        var joinButtonText = this.add.text(this.scale.width/2, this.scale.height/2 + 100 , "CREATE", textStyle);
        joinButtonText.setOrigin(0.5, 0.5);

        var button = new Button(joinButtonText, {
            enable: true,
            mode: 1,              // 0|'press'|1|'release'
            clickInterval: 100    // ms
        });

        button.on('click', () => {
            this.scene.start('GameScene', {playerName: inputText.text});
        });
    }
}