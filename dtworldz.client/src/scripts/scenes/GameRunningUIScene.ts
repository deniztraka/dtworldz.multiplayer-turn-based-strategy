import Phaser from "phaser";
import { GameIsRunningScene } from "./GameIsRunningScene";
import { CharacterPanel } from "../ui/characterPanel";
import FadeOutDestroy from 'phaser3-rex-plugins/plugins/fade-out-destroy.js';
import { ClientPlayer } from "../models/clientPlayer";
import { RemoteCharacterPanel } from "../ui/remoteCharacterPanel";
import CircularProgressCanvas from 'phaser3-rex-plugins/plugins/circularprogresscanvas.js';
import { Client } from "colyseus.js";
import Anchor from "phaser3-rex-plugins/plugins/anchor";
import Button from "phaser3-rex-plugins/plugins/button";
import { ClientActionPanel } from "../ui/clientActionPanel";

export class GameRunningUIScene extends Phaser.Scene {
    gameScene: GameIsRunningScene;
    localCharacterPanel: any;
    remoteCharacterPanels: { [sessionId: string]: RemoteCharacterPanel } = {};
    currentPlayerSessionId: any;
    turnCountDownText: Phaser.GameObjects.Text;
    nextTurnImage: Phaser.GameObjects.Sprite;
    nextTurnButton: Button;
    actionPanel: ClientActionPanel;

    constructor() {
        super({ key: "GameRunningUIScene" });
    }

    init() {
        //sa_tile-props
    }

    preload() {
        this.load.plugin('rexcircularprogresscanvasplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcircularprogresscanvasplugin.min.js', true);
    }


    create() {
        this.gameScene = this.scene.get('GameIsRunningScene') as GameIsRunningScene;
        this.localCharacterPanel = new CharacterPanel(this, this.gameScene.localPlayer, 0, 0, true);

        this.attachEvents();
        this.handleTurnCountDown();
        this.actionPanel =  new ClientActionPanel(this, this.gameScene.localPlayer, 0, 0);
    }

    handleTurnCountDown() {
        const playerCount = Object.keys(this.gameScene.players).length

        if (playerCount !== 0) {
            this.turnCountDownText = this.add.text(0, 0, '', { fontFamily: 'DTSubTitleFontFamily', fontSize: 20, color: '#eeeeee' }).setOrigin(1, 1).setDepth(1000).setAlpha(1).setStroke('#000000', 4);
            this.nextTurnImage = this.add.sprite(0, 0, 'actionIcons', 3).setOrigin(0.5, 0.5).setScale(1.25).setAlpha(0.75);
            new Anchor(this.nextTurnImage, { right: 'right-10', bottom: 'bottom-30' });
            new Anchor(this.turnCountDownText, { right: 'right-10', bottom: 'bottom-10' });


            let scene = this;
            this.nextTurnButton = new Button(this.nextTurnImage, {
                clickInterval: 100,
                mode: 1,
            })
                .on('click', function (button: any, gameObject: any, pointer: any, event: any) {
                    scene.gameScene.requestNextTurn();
                    // rotate nextTurnImage 360 degree with tween
                    scene.tweens.add({
                        targets: scene.nextTurnImage,
                        angle: 360,
                        duration: 500,
                        ease: 'Linear',
                        repeat: 0,
                        onComplete: () => {
                            scene.nextTurnImage.setAngle(0);
                        }
                    });
                }).on('over', function (button: any, gameObject: any, pointer: any, event: any) {
                    scene.nextTurnImage.setAlpha(1);
                }).on('out', function (button: any, gameObject: any, pointer: any, event: any) {
                    scene.nextTurnImage.setAlpha(0.75);
                })


            if (playerCount > 1) {
                this.gameScene.events.on('turn-countdown', (message: { timeLeft: number, totalTime: number }) => {
                    this.turnCountDownText.setText(message.timeLeft.toString());
                });
            }
        }
    }

    clearActions() {
        this.actionPanel.setActions(null);
    }

    attachEvents() {
        this.gameScene.events.on('tile-props', (message: any) => {
            this.actionPanel.setActions(message);
        });

        this.gameScene.events.on('turn-start', (player: ClientPlayer) => {
            //console.log('turn-start: ' + player.sessionId)

            this.events.emit('turn-start', player);
            this.currentPlayerSessionId = player.sessionId;

            let name = "This is your turn!";
            if (this.gameScene.localPlayer.sessionId !== player.sessionId) {
                name = player.playerName + "'s Turn";
                if (this.nextTurnImage) {
                    this.nextTurnImage.setAlpha(0.25);
                    this.nextTurnButton.setEnable(false);
                }
            } else {
                if (this.nextTurnImage) {
                    this.nextTurnImage.setAlpha(1);
                    this.nextTurnButton.setEnable(true);
                }
            }

            if (this.gameScene.getRemotePlayers().length === 0 && this.gameScene.turnCount === 1) {
                name = 'You are alone on your journey...';
            }

            this.createRemoteCharacterPanels(player);

            if ((this.gameScene.getRemoteAlivePlayers().length === 0 && this.gameScene.turnCount !== 1) ||
                this.gameScene.localPlayer.client.isDead) {
                return;
            }

            let turnText = this.add.text(this.scale.width / 2, this.scale.height / 4, name, { fontFamily: 'DTSubTitleFontFamily', fontSize: 26, color: '#eeeeee' }).setOrigin(0.5, 0.5).setDepth(1000).setAlpha(0).setStroke('#000000', 4);
            this.add.existing(turnText);
            this.tweens.add({
                targets: turnText,
                alpha: 1,
                duration: 2000,
                ease: 'Linear',
                repeat: 0,
                onComplete: () => {
                    FadeOutDestroy(turnText, 500);
                }
            });

            
        })



        this.gameScene.events.on('countdown', (message: { timeLeft: number }) => {
            let countDownText = this.add.text(this.scale.width / 2, this.scale.height / 4, message.timeLeft.toString(), { fontFamily: 'DTSubTitleFontFamily', fontSize: 26, color: '#eeeeee' }).setOrigin(0.5, 0.5).setDepth(1000).setAlpha(0).setStroke('#000000', 4);
            this.add.existing(countDownText);
            this.tweens.add({
                targets: countDownText,
                alpha: 1,
                duration: 500,
                ease: 'Linear',
                repeat: 0,
                onComplete: () => {
                    FadeOutDestroy(countDownText, 500);
                }
            });


        });

        this.gameScene.events.on('removed', (sessionId: string) => {
            let remoteCharacterPanel = this.remoteCharacterPanels[sessionId];
            if (remoteCharacterPanel) {
                remoteCharacterPanel.setRemoved();
                remoteCharacterPanel.destroy();
                delete this.remoteCharacterPanels[sessionId]
            }
        });

        this.gameScene.events.on('end-game', (message: any) => {
            let endGameText = this.add.text(this.scale.width / 2, this.scale.height / 4, 'Game Is Ended', { fontFamily: 'DTSubTitleFontFamily', fontSize: 26, color: '#eeeeee' }).setOrigin(0.5, 0.5).setDepth(1000).setAlpha(0).setStroke('#000000', 4);
            this.add.existing(endGameText);
            this.tweens.add({
                targets: endGameText,
                alpha: 1,
                duration: 10000,
                ease: 'Linear',
                repeat: 0,
                onComplete: () => {
                    FadeOutDestroy(endGameText, 500);
                }
            });
        });
    }

    createRemoteCharacterPanels(currentPlayer: ClientPlayer) {

        const remotePlayers = this.gameScene.getRemotePlayers();

        Object.keys(this.remoteCharacterPanels).forEach((key) => {
            this.remoteCharacterPanels[key].destroy();
            delete this.remoteCharacterPanels[key]
        });

        let index = 0;
        remotePlayers.forEach((player: any, index: number) => {
            let y = index * 60 + 100;
            this.remoteCharacterPanels[player.sessionId] = new CharacterPanel(this, player, 0, y, false);
            if (currentPlayer.sessionId === player.sessionId) {
                this.remoteCharacterPanels[player.sessionId].setAlpha(1);
            } else {
                this.remoteCharacterPanels[player.sessionId].setAlpha(0.5);
            }
        });
    }

    getRemotePlayers() {
        return this.gameScene.getRemotePlayers();
    }




    update(time: number, delta: number): void {

    }
}