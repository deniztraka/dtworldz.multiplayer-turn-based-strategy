import { ClientPlayer } from "../models/clientPlayer";
import { GameRunningUIScene } from "../scenes/GameRunningUIScene";
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';

export class CharacterPanel extends Phaser.GameObjects.Container {
    private player: ClientPlayer;
    private healthBarImg: any;
    isLocal: boolean;
    private turnMarker: Phaser.GameObjects.Image;
    constructor(scene: GameRunningUIScene, player: ClientPlayer, x: number, y: number, isLocal: boolean) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.player = player;
        this.isLocal = isLocal;
        this.create();
        scene.add.existing(this);
    }

    

    create() {
        if (this.isLocal) {
            this.createLocalCharacterPanel();
        } else {
            this.createRemoteCharacterPanel();
        }

        this.turnMarker = this.scene.add.image(this.x + 50, this.y, 'turnMarker').setOrigin(0.5, 1).setDisplaySize(75, 50).setAlpha(0);



        this.scene.events.on('turn-start', (player: ClientPlayer) => {
            if(player.sessionId === this.player.sessionId){
                this.turnMarker.setAlpha(1);
            } else {
                this.turnMarker.setAlpha(0);
            }
        });
    }
    createLocalCharacterPanel() {
        const scene = this.scene as any;
        


        this.add(scene.add.image(-18, 70, 'characterPanelBarBG').setOrigin(0, 0).setDisplaySize(260, 30).setTint(0x000000).setAlpha(0.5));
        this.healthBarImg = scene.add.image(-18, 70, 'characterPanelBarBG').setOrigin(0, 0).setDisplaySize(260, 30).setTint(0xff0000);
        this.add(this.healthBarImg);
        this.add(scene.add.image(-18, 70, 'characterPanelBar').setOrigin(0, 0).setDisplaySize(260, 30));

        this.add(scene.add.image(0, 0, 'mainCharFrameBG').setOrigin(0, 0).setDisplaySize(225, 80));
        this.add(scene.add.image(10, 8, 'charIcon' + this.player.client.charIndex).setOrigin(0, 0).setDisplaySize(60, 60));
        this.add(scene.add.image(0, 0, 'mainCharFrame').setOrigin(0, 0).setDisplaySize(225, 80));
        this.add(scene.rexUI.add.textBox({
            x: 0, y: 30,
            width: 120,
            align: 'left',
            text: scene.add.text(0, 0, this.player.playerName, {
                fontSize: 20,
                wordWrap: { width: 120 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily'
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 78, innerRight: 2, innerTop: 30, innerBottom: 2,
            }
        }).setOrigin(0,0.5).layout())

        var anchorCharacterPanel = new Anchor(this, {
            left: 'left-5',
            top: 'bottom-95'
        }).anchor();

    }



    createRemoteCharacterPanel() {
        const scene = this.scene as any;
        // this.add(scene.add.image(0, 70, 'mainCharFrameBG').setOrigin(0, 0).setDisplaySize(185, 50));
        
        // this.add(scene.add.image(0, 70, 'mainCharFrame').setOrigin(0, 0).setDisplaySize(185, 50));

        this.add(scene.add.image(0, 0, 'mainCharFrameBG').setOrigin(0, 0).setDisplaySize(195, 80));
        this.add(scene.add.image(10, 8, 'charIcon' + this.player.client.charIndex).setOrigin(0, 0).setDisplaySize(60, 60));
        this.add(scene.add.image(0, 0, 'mainCharFrame').setOrigin(0, 0).setDisplaySize(195, 80));

        this.add(scene.rexUI.add.textBox({
            x: 60, y: 30,
            width: 120,
            align: 'center',
            
            text: scene.add.text(0, 0, this.player.playerName, {
                fontSize: 18,
                wordWrap: { width: 120 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#ffffff',
            }).setAlpha(0.5),
            space: {
                // For innerSizer
                innerLeft: 2, innerRight: 2, innerTop: 30, innerBottom: 2,
            }
        }).setOrigin(0,0.5).layout())


        var anchorCharacterPanel = new Anchor(this, {
            left: 'left+'+this.x,
            bottom: 'bottom-70'
        }).anchor();
        
    }

    setHealth(health: number) {
        if (this.healthBarImg) {
            this.healthBarImg.setDisplaySize(260 * health / 100, 30);
        }
    }
}