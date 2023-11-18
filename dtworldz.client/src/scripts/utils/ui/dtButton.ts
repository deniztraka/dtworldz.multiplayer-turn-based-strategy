
import Phaser from 'phaser';
import Button from 'phaser3-rex-plugins/plugins/button';
import { DTLabel } from './dtLabel';


export class DTButton extends DTLabel {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, callback?: Function) {
        super(scene, x, y, text);
        this.setOrigin(0.5, 0.5)
        this.setBackgroundColor('#cccccc');
        this.setPadding(40, 10, 40, 10);
        this.setColor('#333333');

        let button = new Button(this, {
            enable: true,
            mode: 1,              // 0|'press'|1|'release'
            clickInterval: 100    // ms
        });

        if(callback){
            button.on('click', callback);
        }
    }

    // Add any additional methods or properties specific to the TextField class here
}