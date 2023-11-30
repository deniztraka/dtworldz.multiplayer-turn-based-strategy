import { Game } from "phaser";
import { ClientPlayer } from "../models/clientPlayer";
import { GameRunningUIScene } from "../scenes/GameRunningUIScene";
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';
import LineProgressCanvas from 'phaser3-rex-plugins/plugins/lineprogresscanvas.js';

export class CharacterPanel extends Phaser.GameObjects.Container {
    private player: ClientPlayer;
    private healthBarImg: any;
    isLocal: boolean;
    remainingTimeBarImg: any;
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
        const self = this.scene as GameRunningUIScene;

        if (this.isLocal) {
            this.createLocalCharacterPanel();
        } else {
            this.createRemoteCharacterPanel();
        }

        this.scene.events.on('turn-start', (player: ClientPlayer) => {
            if (player.sessionId === this.player.sessionId ) {
                this.remainingTimeBarImg.setAlpha(1);
            } else {
                this.remainingTimeBarImg.setAlpha(0);
            }
        });

        this.scene.events.on('turn-countdown', (message: { timeLeft: number, totalTime: number }) => {
            this.setRemainingTime(message.totalTime - message.timeLeft, message.totalTime);
            //console.log('turn-countdown: ' + message.timeLeft + ' ' + message.totalTime)
        });
    }

    createLocalCharacterPanel() {

        this.remainingTimeBarImg = this.scene.add.image(4, -5, 'characterPanelBarBG').setOrigin(0, 0).setDisplaySize(128, 10).setTint(0xffffff).setAlpha(1);
        this.add(this.remainingTimeBarImg);

        this.add(this.scene.add.image(10, 22, 'characterPanelBarBG').setOrigin(0, 0).setDisplaySize(114, 10).setTint(0x000000).setAlpha(0.5));
        this.healthBarImg = this.scene.add.image(10, 22, 'characterPanelBarBG').setOrigin(0, 0).setDisplaySize(114, 10).setTint(0xff0000);
        this.add(this.healthBarImg);
        this.add(this.scene.add.image(10, 22, 'characterPanelBar').setOrigin(0, 0).setDisplaySize(114, 10));

        this.add(this.scene.add.image(18, 0, 'mainCharFrameBG').setOrigin(0, 0).setDisplaySize(100, 25));
        this.add(this.scene.add.image(22, 0, 'charIcon' + this.player.client.charIndex).setOrigin(0, 0).setDisplaySize(20, 20));
        this.add(this.scene.add.image(18, 0, 'mainCharFrame').setOrigin(0, 0).setDisplaySize(100, 25));
        this.add((this.scene as any).rexUI.add.textBox({
            x: 0, y: 0,
            width: 100,
            align: 'left',
            text: this.scene.add.text(0, 0, this.player.playerName, {
                fontSize: 10,
                wordWrap: { width: 100 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily'
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 44, innerRight: 2, innerTop: 30, innerBottom: 2,
            }
        }).setOrigin(0, 0.5).layout())

        var anchorCharacterPanel = new Anchor(this, {
            centerX: 'center-57',
            top: 'bottom-30'
        }).anchor();

    }

    createRemoteCharacterPanel() {
        console.log(this.x + ' ' + this.y)

        const scene = this.scene as any;
        

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
        }).setOrigin(0, 0.5).layout())


        var anchorCharacterPanel = new Anchor(this, {
            left: 'left+' + this.x,
            bottom: 'bottom-70'
        }).anchor();

    }

    setHealth(health: number) {
        if (this.healthBarImg) {
            this.healthBarImg.setDisplaySize(260 * health / 100, 30);
        }
    }

    setRemainingTime(timeLeft: number, totalTime: number) {
        if (this.remainingTimeBarImg) {
            this.remainingTimeBarImg.setDisplaySize(114 * (totalTime - timeLeft) / totalTime, 10);
            
        }
    }
}