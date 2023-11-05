import Phaser from "phaser";

import { LoginScene } from "./scripts/scenes/LoginScene";
import { GameScene } from "./scripts/scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    fps: {
        target: 60,
        forceSetTimeOut: true,
        smoothStep: false,
    },
    width: 800,
    height: 600,
    // height: 200,
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: {
        default: "arcade"
    },
    pixelArt: true,
    scene: [LoginScene, GameScene],
};

new Phaser.Game(config);