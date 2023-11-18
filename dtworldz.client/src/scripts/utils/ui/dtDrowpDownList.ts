
import Phaser from 'phaser';

import { DropDownList } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

const COLOR_PRIMARY = 0xcccccc;
const COLOR_LIGHT = 0x999999;
const COLOR_DARK = 0x333333;


export class DTDrowpDownList extends DropDownList {
    constructor(scene: Phaser.Scene, x: number, y: number, defaultText: string,options: { text: string, value: number }[], selectedCallback: Function) {
        super(scene);

        var style = {
            label: {
                space: { left: 10, right: 10, top: 10, bottom: 10 },
                background: {
                    color: COLOR_PRIMARY
                },
                text: {
                    fontSize: 18,
                    fixedWidth: 210,
                    color: COLOR_DARK,
                    align: 'center',
                },
            },

            button: {
                space: { left: 20, right: 10, top: 20, bottom: 10 },
                background: {
                    color: COLOR_DARK,
                    strokeWidth: 5,
                    'hover.strokeColor': 0x111111,
                    'hover.strokeWidth': 5,
                },
                text: {
                    fontSize: 18,
                    align: 'center',
                },
            }
        }

        var dropDownList = (scene as any).rexUI.add.simpleDropDownList(style)
            .resetDisplayContent(defaultText)
            .setOptions(options)
            .setPosition(x, y)
            .layout()

        dropDownList
            .on('button.click', function (dropDownList: { setText: (arg0: any) => void; }, listPanel: any, button: { text: any; value: any; }, index: any, pointer: any, event: any) {
                dropDownList.setText(button.text)
                if(selectedCallback){
                    selectedCallback(button);
                }
            },);

    }
}