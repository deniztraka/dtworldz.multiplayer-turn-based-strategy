import Phaser from "phaser";
import { GameIsRunningScene } from "./GameIsRunningScene";
import { CharacterPanel } from "../ui/characterPanel";
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';
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

    }


    create() {
        this.gameScene = this.scene.get('GameIsRunningScene') as GameIsRunningScene;
        
        this.localCharacterPanel = new CharacterPanel(this, this.gameScene.localPlayer, 25, 25, true);
        // var anchorCharacterPanel = new Anchor(this.characterPanel, {
        //     left: 'left+50',
        // });
        let index = 0;
        this.gameScene.getRemotePlayers().forEach((player: any, index: number) => {
            let y = index * 150 + 175;

            this.remoteCharacterPanels[player.sessionId] = new CharacterPanel(this, player, 25, y, false);
            // var anchorRemoteCharacterPanel = new Anchor(remoteCharacterPanel, {
            //     left: 'left+88',
            // });
        });

        this.gameScene.events.on('turn-start', (player: ClientPlayer) => {
            this.events.emit('turn-start', player);
        })
    }


    update(time: number, delta: number): void {

        // update health from 0 to 100 in 10 seconds
        this.localCharacterPanel.setHealth((time / 100) % 100);

    }
}