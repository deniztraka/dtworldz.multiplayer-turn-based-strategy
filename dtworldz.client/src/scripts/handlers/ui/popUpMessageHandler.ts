import FadeOutDestroy from "phaser3-rex-plugins/plugins/fade-out-destroy";

export class PopUpMessageHandler {
    static create(scene: Phaser.Scene, message: string, color: string = '#ffffff', duration: number = 2000, x?: number, y?: number, fontSize: number = 18) {
        //onsole.log(x + ' ' + y)
        let textObj = scene.add.text(x ? x : scene.scale.width / 2, y ? y : scene.scale.height / 4 + Math.random() * 100, message, { fontFamily: 'DTSubTitleFontFamily', fontSize: fontSize, color: color ? color : "#ffffff" }).setOrigin(0.5, 0.5);
        scene.add.existing(textObj);

        FadeOutDestroy(textObj, duration);


        // let lostStatText = scene.add.text(scene.scale.width / 2, scene.scale.height / 4 + 75, ' health', { fontFamily: 'DTSubTitleFontFamily', fontSize: 18, color: '#ff000' }).setOrigin(0.5, 0.5)
        // scene.add.existing(lostStatText);
        // FadeOutDestroy(lostStatText, 1000);
    }
}