
import Phaser from 'phaser';
import { DTLabel } from './dtLabel';
import { TextEdit, Edit } from 'phaser3-rex-plugins/plugins/textedit';

export class DTTextInput extends DTLabel {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
        super(scene, x, y, text);
        this.setAlpha(0.5);
        this.setOrigin(0.5, 0.5)
        this.setBackgroundColor('#444444');
        this.setPadding(20, 10, 20, 10);
        this.setColor('#cccccc');
        let initialText = text;

        let editorConfig = {
            type: 'text',
            enterClose: true,
            selectAll: true,

            onOpen: function (textObject: any) {

            },
            onTextChanged: function (textObject: any, text: any) {
                textObject.text = text;
                //trim if more than 10 chars
                if (textObject.text.length > 10) {
                    textObject.text = textObject.text.substring(0, 10);
                }

                //remove spaces
                textObject.text = textObject.text.replace(/\s/g, '');

            },
            onClose: function (textObject: any) {
                if (textObject.text === '' || textObject.text === undefined) {
                    textObject.setAlpha(0.5);
                    textObject.text = initialText;
                } else {
                    textObject.setAlpha(1);
                }
            },
            
        };

        // @ts-ignore: Unreachable code error
        var editor = new TextEdit(this, editorConfig);
    }


    // Add any additional methods or properties specific to the TextField class here
}