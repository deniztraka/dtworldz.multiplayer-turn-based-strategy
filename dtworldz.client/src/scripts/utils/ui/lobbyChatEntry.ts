import { LobbyScene } from "../../scenes/LobbyScene";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

const entryWidth = 460;
const fontSize = 12


export class LobbyChatEntry {
    textBox: any;
    constructor(scene: any, owner: string, text: string, x: number, y: number) {
        this.textBox = scene.rexUI.add.textBox({
            x: x, y: y,
            width: entryWidth,
            align:{
                title: 'left',
            },

            innerBackground: scene.rexUI.add.roundRectangle({
                radius: 3,
                color: 0x333333,
                strokeColor: COLOR_DARK, strokeWidth: 1
            }).setAlpha(0.25),

            text: scene.add.text(0, 0, text, {
                fontSize: fontSize,
                wordWrap: { width: entryWidth - 10 },
                maxLines: 4
            }),

            title: scene.rexUI.add.label({
                
                background: scene.rexUI.add.roundRectangle({
                    // radius: 3,
                    color: 0x222222,
                    // strokeColor: COLOR_LIGHT, strokeWidth: 1
                }).setAlpha(0.5),
                text: scene.add.text(0, 0, owner, { fontSize: fontSize + 2 }).setColor("#E8D9A1"),
                align: 'center',
                space: {
                    left: 3, right: 3, top: 3, bottom: 3,
                    icon: 3,
                    text: 3,
                },
                // icon: scene.add.image(0, 0, 'heroIcon0').setDisplaySize(20, 20),
            }),
            space: {
                // For innerSizer
                innerLeft:  5, innerRight: 2, innerTop: 2, innerBottom: 2,

                title: 0, titleLeft: 0,
                icon: 10, text: 10,
            }
        })
            .layout().start(text, 10);
    }
}