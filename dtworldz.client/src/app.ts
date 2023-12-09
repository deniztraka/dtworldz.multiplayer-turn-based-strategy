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
    // Game size
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        width: 1920,
        height: 1080,

        // Minimum size
        min: {
            width: 640,
            height: 360
        },
        // Or set minimum size like these
        // minWidth: 800,
        // minHeight: 600,

        // Maximum size
        max: {
            width: 1920,
            height: 1080
        },
        // Or set maximum size like these
        // maxWidth: 1600,
        // maxHeight: 1200,

        zoom: 1,  // Size of game canvas = game size * zoom
    },
    roundPixels: false,
  	antialias: false,
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