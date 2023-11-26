import Phaser from "phaser";

import { LobbyScene } from "./scripts/scenes/LobbyScene";
import { CreateOrJoinScene } from "./scripts/scenes/CreateOrJoinScene";
import { GameLoadingScene } from "./scripts/scenes/GameLoadingScene";
import { GameIsRunningScene } from "./scripts/scenes/GameIsRunningScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    fps: {
        target: 60,
        forceSetTimeOut: true,
        smoothStep: false,
    },
    width: 1084,
    height: 1084,
    // Game size
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        // Or put game size here
        // width: 1024,
        // height: 768,

        // Minimum size
        min: {
            width: 1084,
            height: 1084
        },
        

        // Maximum size
        max: {
            width: 1980,
            height: 1980
        },
        // Or set maximum size like these
        // maxWidth: 1600,
        // maxHeight: 1200,

        zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false,
    // height: 200,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: "arcade"
    },
    pixelArt: true,
    scene: [CreateOrJoinScene, LobbyScene, GameLoadingScene, GameIsRunningScene ],
    dom: {
        createContainer: true
    },
};

new Phaser.Game(config);