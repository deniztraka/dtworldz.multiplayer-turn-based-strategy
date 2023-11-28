import Phaser from "phaser";
import { GameIsRunningScene } from "./GameIsRunningScene";
import { CharacterPanel } from "../ui/characterPanel";

import { ClientPlayer } from "../models/clientPlayer";
import { RemoteCharacterPanel } from "../ui/remoteCharacterPanel";

export class GameRunningUIScene extends Phaser.Scene {
    gameScene: GameIsRunningScene;
    localCharacterPanel: any;
    remoteCharacterPanels: { [sessionId: string]: RemoteCharacterPanel } = {};

    constructor() {
        super({ key: "GameRunningUIScene"});
    }

    init() {
        
    }

    preload() {
        this.load.image('turnMarker', '/assets/images/turnMarker.png');
    }


    create() {
        this.gameScene = this.scene.get('GameIsRunningScene') as GameIsRunningScene;
        
        
        this.localCharacterPanel = new CharacterPanel(this, this.gameScene.localPlayer, 0, 0, true);
        
        
        let index = 0;
        this.gameScene.getRemotePlayers().forEach((player: any, index: number) => {
            let x = index * 185 + 220;

            this.remoteCharacterPanels[player.sessionId] = new CharacterPanel(this, player, x, 0, false);
            // var anchorRemoteCharacterPanel = new Anchor(remoteCharacterPanel, {
            //     left: 'left+88',
            // });
        });

        this.gameScene.events.on('turn-start', (player: ClientPlayer) => {
            this.events.emit('turn-start', player);
        })

        this.gameScene.events.on('turn-countdown', (timeLeft: number) => {
            console.log('turn-countdown: ' + timeLeft);
        })
    }




    update(time: number, delta: number): void {

        // update health from 0 to 100 in 10 seconds
        //this.localCharacterPanel.setHealth((time / 100) % 100);

    }
}