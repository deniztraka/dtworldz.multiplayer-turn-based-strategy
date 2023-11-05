export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'heroImage');
        this.setOrigin(0.5, 1);
        scene.add.existing(this);
    }
}