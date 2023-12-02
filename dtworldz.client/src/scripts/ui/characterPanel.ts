
import { ClientPlayer } from "../models/clientPlayer";
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';

export class CharacterPanel extends Phaser.GameObjects.Container {
    private player: ClientPlayer;
    isLocal: boolean;
    healthText: any;
    hungerText: any;
    energyText: any;
    coinsText: any;
    weaponText: any;
    damageText: any;
    removedImage: any;
    constructor(scene: any, player: ClientPlayer, x: number, y: number, isLocal: boolean) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.player = player;
        this.isLocal = isLocal;
        this.create();
        scene.add.existing(this);
    }



    create() {
        const self = this.scene as any;

        if (this.isLocal) {
            this.createLocalCharacterPanel();
        } else {
            this.createRemoteCharacterPanel();
        }

        this.player.client.listen("_health", (currentValue: number, previousValue: any) => {
            this.healthText.setText(currentValue.toString());
        });

        this.player.client.listen("_hunger", (currentValue: number, previousValue: any) => {
            this.hungerText.setText(currentValue.toString());
        });

        this.player.client.listen("_energy", (currentValue: number, previousValue: any) => {
            this.energyText.setText(currentValue.toString());
        });
    }


    createLocalCharacterPanel() {
        // this.remainingTimeBarImg = this.scene.add.image(0, -60, 'characterPanelBarBG').setOrigin(0, 1).setTint(0xffffff).setAlpha(1).setDisplaySize(248, 4);
        // this.add(this.remainingTimeBarImg);
        this.add((this.scene as any).rexUI.add.roundRectangle(0, 0, 300, 60, 2, 0x000000).setOrigin(0, 0).setAlpha(0.5));
        this.add(this.scene.add.sprite(70, 60, 'playerStatusIcons', 0).setOrigin(0, 1).setScale(0.35));
        this.healthText = (this.scene as any).rexUI.add.textBox({
            x: 60, y: 40,
            width: 200,
            align: 'center',
            text: this.scene.add.text(0, 0, this.player.client._health, {
                fontSize: 14,
                wordWrap: { width: 200 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#ff432a',
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 40, innerRight: 2, innerTop: 0, innerBottom: 2,
            }
        }).setOrigin(0, 0).layout();
        this.add(this.healthText);

        this.add(this.scene.add.sprite(140, 60, 'playerStatusIcons', 1).setOrigin(0, 1).setScale(0.35));
        this.hungerText = (this.scene as any).rexUI.add.textBox({
            x: 130, y: 40,
            width: 200,
            align: 'center',
            text: this.scene.add.text(0, 0, this.player.client._hunger, {
                fontSize: 14,
                wordWrap: { width: 200 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#fbaf71',
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 40, innerRight: 2, innerTop: 0, innerBottom: 2,
            }
        }).setOrigin(0, 0).layout();
        this.add(this.hungerText);

        this.add(this.scene.add.sprite(210, 60, 'playerStatusIcons', 2).setOrigin(0, 1).setScale(0.35));
        this.energyText = (this.scene as any).rexUI.add.textBox({
            x: 200, y: 40,
            width: 200,
            align: 'center',
            text: this.scene.add.text(0, 0, this.player.client._energy, {
                fontSize: 14,
                wordWrap: { width: 200 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#3bdef3',
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 40, innerRight: 2, innerTop: 0, innerBottom: 2,
            }
        }).setOrigin(0, 0).layout();
        this.add(this.energyText);

        this.add(this.scene.add.image(0, 0, 'mainCharFrameBG').setOrigin(0, 0).setDisplaySize(60, 60));
        this.add(this.scene.add.image(10, 6, 'charIcon' + this.player.client.charIndex).setOrigin(0, 0));
        this.add(this.scene.add.image(0, 0, 'mainCharFrame').setOrigin(0, 0).setDisplaySize(60, 60));

        this.add((this.scene as any).rexUI.add.textBox({
            x: 0, y: 10,
            width: 200,
            align: 'center',
            text: this.scene.add.text(0, 0, this.player.playerName, {
                fontSize: 18,
                wordWrap: { width: 200 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#ffffff',
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 70, innerRight: 2, innerTop: 0, innerBottom: 2,
            }
        }).setOrigin(0, 0.5).layout());
        
        this.add((this.scene as any).rexUI.add.textBox({
            x: 0, y: 25,
            width: 300,
            align: 'center',
            text: this.scene.add.text(0, 0, this.player.client.title, {
                fontSize: 14,
                wordWrap: { width: 300 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#f9d133',
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 70, innerRight: 2, innerTop: 0, innerBottom: 2,
            }
        }).setOrigin(0, 0.5).layout());

        var anchorCharacterPanel = new Anchor(this, {
            left: 'left-4',
            top: 'top'
        }).anchor();





        console.log(this.player.client);
    }

    createRemoteCharacterPanel() {
        const scene = this.scene as any;

        this.add(this.scene.add.image(0, 0, 'mainCharFrameBG').setOrigin(0, 0).setDisplaySize(40, 40));
        this.add(this.scene.add.image(5, 6, 'charIcon' + this.player.client.charIndex).setOrigin(0, 0).setDisplaySize(30, 30));
        this.add(this.scene.add.image(0, 0, 'mainCharFrame').setOrigin(0, 0).setDisplaySize(40, 40));

        this.add(scene.rexUI.add.textBox({
            x: 40, y: 10,
            width: 120,
            align: 'center',

            text: scene.add.text(0, 0, this.player.playerName, {
                fontSize: 16,
                wordWrap: { width: 120 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#ffffff',
            }).setAlpha(0.5),
            space: {
                // For innerSizer
                innerLeft: 10, innerRight: 2, innerTop: 30, innerBottom: 2,
            }
        }).setOrigin(0, 0.5).layout())

        this.removedImage = (this.scene.add as any).image(5, 6, 'notready').setOrigin(0,0).setDisplaySize(25, 25).setAlpha(0);
        this.add(this.removedImage);
        //console.log('bottom-' + this.y)
        var anchorCharacterPanel = new Anchor(this, {
            left: 'left',
            bottom: 'top+' + this.y
        }).anchor();

    }

    setRemainingTime(timeLeft: number, totalTime: number) {
        // if (this.remainingTimeBarImg) {
        //     this.remainingTimeBarImg.setDisplaySize(248 * timeLeft / totalTime, 4);
        // }
    }

    setRemoved() {
        
        this.removedImage.setAlpha(0.75);
    }

}