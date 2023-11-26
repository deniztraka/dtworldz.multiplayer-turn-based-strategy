import { LobbyChatEntry } from "./lobbyChatEntry";
import { TextEdit, Edit } from 'phaser3-rex-plugins/plugins/textedit';


export class LobbyChatPanel {
    scene: any;
    scrollablePanel: any;
    panel: any;
    entries: any[];
    maxEntries: number = 20;
    constructor(scene: any, x: number, y: number) {
        this.scene = scene;
        this.entries = [];
        let self = this;

        let initialText = 'write something...';
        let chatInputField = scene.add.text(0, 0, initialText, {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#333333',
            fixedWidth: 250,
            fixedHeight: 20,
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5,
            },
        }).setAlpha(0.5);

        let editorConfig = {
            type: 'text',
            enterClose: true,
            selectAll: true,

            onOpen: function (textObject: any) {
                textObject.text = '';
            },
            onTextChanged: function (textObject: any, text: any) {
                textObject.text = text;

            },
            onClose: function (textObject: any) {

                // send message if not empty
                if (textObject.text !== '' && textObject.text !== undefined) {
                    // @ts-ignore: Unreachable code error
                    self.sendChatMessage(textObject.text);
                    textObject.text = '';
                }

                textObject.text = initialText;
            },

        };

        // @ts-ignore: Unreachable code error
        var editor = new TextEdit(chatInputField, editorConfig);

        this.scrollablePanel = scene.rexUI.add.scrollablePanel({
            x: x, y: y,
            height: 220,
            width: 250,

            scrollMode: 'y',

            background: scene.rexUI.add.roundRectangle({
                color: 0x000000,
                radius: 3
            }).setAlpha(0.25),

            panel: {
                child: this.createChatPanel(),

                mask: { padding: 1, },
            },

            slider: {
                track: scene.rexUI.add.roundRectangle({ width: 5, radius: 5, color: 0x111111 }),
                thumb: scene.rexUI.add.roundRectangle({ radius: 8, color: 0x443D22 }),
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            footer: chatInputField,

            space: { left: 0, right: 0, top: 0, bottom: 0, panel: 3, header: 5, footer: 5 }
        }).layout()

        // Add empty entry maxentries times
        for (let i = 0; i < this.maxEntries; i++) {
            this.addEntry('', '');
        }



        scene.input.keyboard.on('keydown', function (event: any) { 
            if (event.key === "Enter") {
                // @ts-ignore: Unreachable code error
                editor.open();
            } else if (event.key === "Escape") {
                // @ts-ignore: Unreachable code error
                editor.close();
            }
         });
    }

    sendChatMessage(message: string) {
        if (message.trim().length === 0) return; // Ignore empty messages

        // Assuming 'this.room' is your Colyseus room instance
        this.scene.room.send('chat', message);
    }

    addEntry(owner: string, text: string) {
        let chatEntry = new LobbyChatEntry(this.scene, owner, text, this.scene.scale.width / 2 + 50, this.scene.scale.height / 2);
        this.panel.add(chatEntry.textBox);
        this.entries.push(chatEntry.textBox);

        // destroy first entry if there is more than 20
        if (this.entries.length > this.maxEntries) {
            this.entries[0].destroy();
            this.entries.shift();
        }

        this.scrollablePanel.scrollToBottom();

        // this.panel.layout();
        this.scrollablePanel.layout();
    }

    createChatPanel() {
        this.panel = this.scene.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 10, top: 0, bottom: 0 }
        })
        return this.panel;
    }
}