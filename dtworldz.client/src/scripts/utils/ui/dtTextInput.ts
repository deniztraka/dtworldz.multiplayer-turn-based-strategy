
import Phaser from 'phaser';
import { DTLabel } from './dtLabel';
import { TextEdit, Edit } from 'phaser3-rex-plugins/plugins/textedit';
import Anchor from 'phaser3-rex-plugins/plugins/anchor';

export class DTTextInput extends DTLabel {
    currentScale: number;
    editor: TextEdit;
    constructor(scene: any, x: number, y: number, text: string, config?: any, anchorConfig?: any) {
        let options = {
            x: x,
            y: y,
            fixedWidth: 150,
            fixedHeight: 30,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, {
                x: 10,
                y: 10
            }, 0x000000).setAlpha(0.5).setStrokeStyle(2, 0x000000),
            padding: { left: 10, right: 10, top: 5, bottom: 5, },
            ...config,
        };


        super(scene, x, y, text, options);

        this.currentScale = 1;

        const self = this;
        let editorConfig = {
            type: 'text',
            enterClose: true,
            selectAll: true,

            onOpen: function (textObject: any) {
                self.layout();
            },
            onTextChanged: function (textObject: any, text: any) {
                textObject.text = text;

                //trim if more than 10 chars
                if (textObject.text.length > 10) {
                    textObject.text = textObject.text.substring(0, 10);
                }

                //remove spaces
                textObject.text = textObject.text.replace(/\s/g, '');
                self.scale = self.currentScale;
                self.layout();

            },
            onClose: function (textObject: any) {
                if (textObject.text === '' || textObject.text === undefined) {
                    textObject.setAlpha(0.5);
                    textObject.text = text;
                } else {
                    textObject.setAlpha(1);
                }
                self.layout();
            },
        };


        this.layout();

        // @ts-ignore: Unreachable code error
        this.editor = new TextEdit(this.getElement('text'), editorConfig);
        scene.add.existing(this);

        if (anchorConfig) {
            new Anchor(this, anchorConfig);
        }
    }

    setScale(scale: number): this {
        //(this.getElement('text') as any).setScale(scale);
        super.setScale(scale);
        this.currentScale = scale;
        // this.layout();
        return this;
    }

    openEditor() {
        if (this.editor) {
            this.editor.open();
        }
    }

    closeEditor() {
        if (this.editor) {
            this.editor.close();
        }
    }
}