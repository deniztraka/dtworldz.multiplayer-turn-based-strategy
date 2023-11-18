
import Phaser from 'phaser';


export class DTLabel extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
        super(scene, x, y, text, {});
        this.setOrigin(0.5, 0.5)
    }
    

    // Add any additional methods or properties specific to the TextField class here
}