
import Button from 'phaser3-rex-plugins/plugins/button';
import { DTLabel } from './dtLabel';
import Anchor from 'phaser3-rex-plugins/plugins/anchor';


export class DTButton extends DTLabel {
    button: Button;

    constructor(scene: any, x: number, y: number, text: string, callback?: Function, anchorConfig?: any) {
        super(scene, x, y, text, {
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, {
                x: 10,
                y: 10
            }, 0x000000).setAlpha(0.75).setStrokeStyle(4, 0x000000),
        });
        const self = this;
        (this.getElement('text') as any).setStroke('#111111', 1)
        this.button = new Button(this, {
            enable: true,
            mode: 1,              // 0|'press'|1|'release'
            clickInterval: 100    // ms
        });

        if (callback) {
            this.button.on('click', callback);
        }

        this.button.on('over', function (button: any, groupName: any, index: any, pointer: any, event: any) {
            (self.getElement('text') as any).setColor('#ffffff');
            (self.getElement('background') as any).setFillStyle(0x333333)
        }).on('out', function (button: any, groupName: any, index: any, pointer: any, event: any) {
            (self.getElement('text') as any).setStroke('#000000', 1);
            (self.getElement('text') as any).setColor('#cccccc');
            (self.getElement('background') as any).setFillStyle(0x000000)
        }).on('down', function (button: any, groupName: any, index: any, pointer: any, event: any) {
            (self.getElement('text') as any).setStroke('#000000', 0);
            (self.getElement('background') as any).setFillStyle(0x111111)
        }).on('up', function (button: any, groupName: any, index: any, pointer: any, event: any) {
            (self.getElement('text') as any).setStroke('#000000', 1);
            (self.getElement('background') as any).setFillStyle(0x000000)
        })

        if (anchorConfig) {
            new Anchor(this, anchorConfig)
        }
    }

    setEnabled(enabled: boolean) {
        this.button.setEnable(enabled);
        (this.getElement('text') as any).setAlpha(enabled ? 1 : 0.5);
        return this;
    }

    // Add any additional methods or properties specific to the TextField class here
}