
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

        this.player.client.listen("health", (currentValue: number, previousValue: any) => {
            this.healthText.setText(currentValue.toString());
        });

        this.player.client.listen("hunger", (currentValue: number, previousValue: any) => {
            this.hungerText.setText(currentValue.toString());
        });

        this.player.client.listen("energy", (currentValue: number, previousValue: any) => {
            this.energyText.setText(currentValue.toString());
        });
    }


    createLocalCharacterPanel() {
        // this.remainingTimeBarImg = this.scene.add.image(0, -60, 'characterPanelBarBG').setOrigin(0, 1).setTint(0xffffff).setAlpha(1).setDisplaySize(248, 4);
        // this.add(this.remainingTimeBarImg);
        this.add((this.scene as any).rexUI.add.roundRectangle(0, 0, 280, 60, 2, 0x000000).setOrigin(0, 0).setAlpha(0.5));
        this.add(this.scene.add.sprite(70, 25, 'playerStatusIcons', 0).setOrigin(0, 0).setScale(0.5));
        this.healthText = (this.scene as any).rexUI.add.textBox({
            x: 60, y: 40,
            width: 200,
            align: 'center',
            text: this.scene.add.text(0, 0, this.player.client.health, {
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

        this.add(this.scene.add.sprite(140, 25, 'playerStatusIcons', 1).setOrigin(0, 0).setScale(0.5));
        this.hungerText = (this.scene as any).rexUI.add.textBox({
            x: 130, y: 40,
            width: 200,
            align: 'center',
            text: this.scene.add.text(0, 0, this.player.client.hunger, {
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

        this.add(this.scene.add.sprite(210, 25, 'playerStatusIcons', 2).setOrigin(0, 0).setScale(0.5));
        this.energyText = (this.scene as any).rexUI.add.textBox({
            x: 200, y: 40,
            width: 200,
            align: 'center',
            text: this.scene.add.text(0, 0, '10', {
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

        // this.add(this.scene.add.sprite(280, 25, 'playerStatusIcons', 4).setOrigin(0, 0).setScale(0.5));
        // this.coinsText = (this.scene as any).rexUI.add.textBox({
        //     x: 270, y: 40,
        //     width: 200,
        //     align: 'center',
        //     text: this.scene.add.text(0, 0, '10', {
        //         fontSize: 18,
        //         wordWrap: { width: 200 },
        //         maxLines: 1,
        //         fontFamily: 'DTBodyFontFamily',
        //         color: '#fffca0',
        //     }).setAlpha(0.8),
        //     space: {
        //         // For innerSizer
        //         innerLeft: 40, innerRight: 2, innerTop: 0, innerBottom: 2,
        //     }
        // }).setOrigin(0, 0).layout();
        // this.add(this.coinsText);

        // this.add(this.scene.add.sprite(350, 25, 'playerStatusIcons', 5).setOrigin(0, 0).setScale(0.5));
        // this.damageText = (this.scene as any).rexUI.add.textBox({
        //     x: 340, y: 40,
        //     width: 200,
        //     align: 'center',
        //     text: this.scene.add.text(0, 0, '10', {
        //         fontSize: 18,
        //         wordWrap: { width: 200 },
        //         maxLines: 1,
        //         fontFamily: 'DTBodyFontFamily',
        //         color: '#ffffff',
        //     }).setAlpha(0.8),
        //     space: {
        //         // For innerSizer
        //         innerLeft: 40, innerRight: 2, innerTop: 0, innerBottom: 2,
        //     }
        // }).setOrigin(0, 0).layout();
        // this.add(this.damageText);

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

        var anchorCharacterPanel = new Anchor(this, {
            left: 'left-4',
            top: 'top'
        }).anchor();
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

    setHealth(currentValue: number) {
        if (this.healthText) {
            this.healthText.setText(currentValue.toString());
        }
    }

    setHunger(currentValue: number) {
        if (this.hungerText) {
            this.hungerText.setText(currentValue.toString());
        }
    }

    setEnergy(currentValue: number) {
        if (this.energyText) {
            this.energyText.setText(currentValue.toString());
        }
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