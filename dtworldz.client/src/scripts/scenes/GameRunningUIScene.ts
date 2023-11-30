import Phaser from "phaser";
import { GameIsRunningScene } from "./GameIsRunningScene";
import { CharacterPanel } from "../ui/characterPanel";
import FadeOutDestroy from 'phaser3-rex-plugins/plugins/fade-out-destroy.js';
import { ClientPlayer } from "../models/clientPlayer";
import { RemoteCharacterPanel } from "../ui/remoteCharacterPanel";
import CircularProgressCanvas from 'phaser3-rex-plugins/plugins/circularprogresscanvas.js';

export class GameRunningUIScene extends Phaser.Scene {
    gameScene: GameIsRunningScene;
    localCharacterPanel: any;
    remoteCharacterPanels: { [sessionId: string]: RemoteCharacterPanel } = {};
    currentPlayerSessionId: any;

    constructor() {
        super({ key: "GameRunningUIScene"});
    }

    init() {
        
    }

    preload() {
        this.load.plugin('rexcircularprogresscanvasplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcircularprogresscanvasplugin.min.js', true);
    }


    create() {
        this.gameScene = this.scene.get('GameIsRunningScene') as GameIsRunningScene;

        this.localCharacterPanel = new CharacterPanel(this, this.gameScene.localPlayer, this.scale.width/2, this.scale.height/2, true);

        let index = 0;
        // this.gameScene.getRemotePlayers().forEach((player: any, index: number) => {
        //     let x = index * 185 + 220;

        //     this.remoteCharacterPanels[player.sessionId] = new CharacterPanel(this, player, x, 0, false);
        // });

        this.gameScene.events.on('turn-start', (player: ClientPlayer) => {
            //console.log('turn-start: ' + player.sessionId)

            this.events.emit('turn-start', player);
            this.currentPlayerSessionId = player.sessionId;

            let name = this.gameScene.localPlayer.sessionId == player.sessionId ? 'Your Turn!' : player.playerName + "'s Turn";
            if(this.gameScene.getRemotePlayers().length === 0){
                name = 'You are alone in your journey...';
            }

            let turnText = this.add.text(this.scale.width/2, this.scale.height/2, name, { fontFamily: 'DTSubTitleFontFamily', fontSize: 18, color: '#eeeeee' }).setOrigin(0.5, 0.5).setDepth(1000).setAlpha(0).setStroke('#000000', 4);
            this.add.existing(turnText);
            this.tweens.add({
                targets: turnText,
                alpha: 1,
                duration: 3000,
                ease: 'Linear',
                repeat: 0,
                onComplete: () => {
                    FadeOutDestroy(turnText, 100);
                }
            });
        })

        if(this.gameScene.getRemotePlayers().length !== 0){
            this.gameScene.events.on('turn-countdown', (message:{timeLeft:number, totalTime:number}) => {
                if(this.gameScene.localPlayer.sessionId === this.currentPlayerSessionId){
                    this.localCharacterPanel.setRemainingTime(message.timeLeft, message.totalTime);
                } else {
                    let remoteCharacterPanel = this.remoteCharacterPanels[this.currentPlayerSessionId];
                    if(remoteCharacterPanel){
                        remoteCharacterPanel.setRemainingTime(message.timeLeft, message.totalTime);
                    }
                }
            });
        }
    }

    getRemotePlayers() {
        return this.gameScene.getRemotePlayers();
    }




    update(time: number, delta: number): void {

    }
}