
import Phaser from 'phaser';

export class DTText extends Phaser.GameObjects.Text {
    constructor(scene:any, x:number, y:number, text:string, style:any) {
        super(scene, x, y, text, style);
        scene.add.existing(this);
    }
    resize(width:number, height:number) {
        this.setFixedSize(width, height);
        return this;
    }
}