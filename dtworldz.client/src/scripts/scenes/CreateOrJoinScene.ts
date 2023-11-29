import Phaser from "phaser";


import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../../backend";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from './../utils/ui/textStyles';
import { DTTextInput } from "../utils/ui/dtTextInput";
import { TextEdit } from 'phaser3-rex-plugins/plugins/textedit';
import Button from 'phaser3-rex-plugins/plugins/button';

export class CreateOrJoinScene extends Phaser.Scene {
    room: Room | undefined;
    nickNameText: DTTextInput;

    errorText: DTLabel;
    roomId: any;


    constructor() {
        super({ key: "CreateOrJoinScene" });
    }

    preload() {
        this.load.image('loginBackground', '/assets/images/bg.png');
        this.load.image('frame', '/assets/images/frame.png');
        this.load.image('buttonFrame', '/assets/images/buttonFrame-lowRes.png');
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js';
        this.load.plugin('rexbbcodetextplugin', url, true);
      
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js';
        this.load.plugin('rextexteditplugin', url, true);

        
    
    }

    create() {
        this.createBackground();
        this.createNickNameInput();
        this.createButtons();

        

        this.errorText = new DTLabel(this, this.scale.width / 2, this.scale.height / 2 + 50, "")
            .setStyle({
                fontFamily: 'DTBodyTextFontFamily',
                fontSize: '12px',
                align: 'center',
                fixedWidth: 0,
                fixedHeight: 0,
                padding: {
                    left: 40,
                    right: 40,
                    top: 5,
                    bottom: 5,
                }
            })
            .setColor("#ffffff");
        this.add.existing(this.errorText);
    }

    createButtons() {
        const buttonWidth = 66;
        const buttonHeight = 20;

        const scene: any = this;

        const createText = scene.add.text(0, 0, "CREATE", {
            fontSize: '10px',
            fontFamily: "DTBodyFontFamily",
            color: '#dcd9ce',
            fixedWidth: 100,
            fixedHeight: 20,
            padding: {
                top: 4,
                bottom: 4,
                left: 0,
                right: 0,
            }
        })
            .setOrigin(0.5, 0.5)
            .setAlign('center')
            .setAlpha(0.5).setScale(1);

        new Button(this.add.container(this.scale.width / 2, this.scale.height / 2 + 75, [
            scene.rexUI.add.roundRectangle(0, 0, buttonWidth, buttonHeight, {
                x: 10,
                y: 10
            }, 0x000000),
            scene.add.image(0, 0, 'buttonFrame')
                .setOrigin(0.5, 0.5),
            createText
        ]).setSize(buttonWidth, buttonHeight), {
            enable: true,
            mode: 1,              // 0|'press'|1|'release'
            clickInterval: 100,    // ms
            threshold: undefined
        }).on('click', function (button: any, gameObject: any, pointer: any, event: any) {
            scene.onCreateClicked()
        }).on('over', function (button: any, gameObject: any, pointer: any, event: any) {
            createText.setAlpha(1);
        }).on('out', function (button: any, gameObject: any, pointer: any, event: any) {
            createText.setAlpha(0.5);
        });

        const joinText = scene.add.text(0, 0, "JOIN", {
            fontSize: '10px',
            fontFamily: "DTBodyFontFamily",
            color: '#dcd9ce',
            fixedWidth: buttonWidth,
            fixedHeight: buttonHeight,
            padding: {
                top: 4,
                bottom: 4,
                left: 10,
                right: 10,
            }
        })
            .setOrigin(0.5, 0.5)
            .setAlign('center')
            .setAlpha(0.5).setScale(1);

        new Button(this.add.container(this.scale.width / 2, this.scale.height / 2 + 100, [
            scene.rexUI.add.roundRectangle(0, 0, buttonWidth, buttonHeight, {
                x: 10,
                y: 10
            }, 0x000000),
            scene.add.image(0, 0, 'buttonFrame')
                .setOrigin(0.5, 0.5),
            joinText
        ]).setSize(buttonWidth, buttonHeight), {
            enable: true,
            mode: 1,              // 0|'press'|1|'release'
            clickInterval: 100,    // ms
            threshold: undefined
        }).on('click', function (button: any, gameObject: any, pointer: any, event: any) {
            scene.onJoinClicked()
        }).on('over', function (button: any, gameObject: any, pointer: any, event: any) {
            joinText.setAlpha(1);
        }).on('out', function (button: any, gameObject: any, pointer: any, event: any) {
            joinText.setAlpha(0.5);
        })
    }

    createBackground() {
        const scene: any = this;
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5)
    }

    createNickNameInput() {
        const scene: any = this;
        let initialText = 'your name';
        this.add.container(this.scale.width / 2, this.scale.height / 2, [
            scene.rexUI.add.roundRectangle(0, 0, 84, 20, {
                x: 10,
                y: 10
            }, 0x000000).setAlpha(0.6),
            this.add.image(0, 0, 'buttonFrame')
                .setOrigin(0.5, 0.5).setDisplaySize(84, 20)
        ])
        this.nickNameText = scene.add.text(this.scale.width / 2, this.scale.height / 2, initialText, {
            fontSize: '9px',
            fontFamily: "DTBodyFontFamily",
            color: '#dddddd',
            fixedWidth: 84,
            fixedHeight: 20,
            padding: {
                top: 4,
                bottom: 4,
                left: 4,
                right: 4,
            },
            align: 'center',
        })
        .setOrigin(0.5, 0.5).setAlpha(0.5)

        let editorConfig = {
            type: 'text',
            enterClose: true,
            selectAll: true,

            onOpen: function (textObject: any) {
            },
            onTextChanged: function (textObject: any, text: any) {
                textObject.text = text;

                //trim if more than 9 chars
                if (textObject.text.length > 9) {
                    textObject.text = textObject.text.substring(0, 9);
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
        var editor = new TextEdit(this.nickNameText, editorConfig);

        scene.input.keyboard.on('keydown', function (event: any) {
            if (event.key === "Enter") {
                if (scene.validateNickName()) {
                    scene.onCreateClicked();
                } else {

                    // @ts-ignore: Unreachable code error
                    editor.open();
                }
            } else if (event.key === "Escape") {
                scene.validateNickName()
                // @ts-ignore: Unreachable code error
                editor.close();
            }
        });
    }

    async onCreateClicked() {

        if (!this.validateNickName()) {
            return;
        }

        await this.connect(this.nickNameText.text);
    }

    onJoinClicked() {
        let self = this;
        if (!this.validateNickName()) {
            return;
        }

        let dialog = CreateDialog(this)
            .setPosition(this.scale.width / 2, this.scale.height / 2)
            .layout()
            .modal({
                touchOutsideClose: true,
                manaulClose: true,
                duration: {
                    in: 100,
                    out: 100
                }
            })

        dialog.on('action.click', function (button: { text: string; }, index: any, pointer: any, event: any) {
            let roomId = dialog.getElement('content').text;
            if (button.text === "Yes" && self.validateNickName() && self.validateRoomId(roomId)) {
                self.connect(self.nickNameText.text, roomId);
            }
        }, this);
    }

    async connect(clientName: string, roomId?: string) {
        // add connection status text
        this.errorText.text = "connecting to the server...";

        const client = new Client(BACKEND_URL);

        try {
            // if room id is provided, join the room
            if (roomId) {
                this.room = await client.joinById(roomId, { clientName: clientName });
            } else {
                this.room = await client.create("dtworldz", { clientName: clientName, maxPlayers: 5 });
            }

            this.scene.start('LobbyScene', { room: this.room, playerName: clientName });

        } catch (e: any) {
            // couldn't connect
            this.errorText.text = e.message;
        }
    }

    validateRoomId(roomId: string) {
        if (roomId === 'enter room id') {
            this.errorText.text = "please enter room id";
            return false;
        } else {
            this.errorText.text = "";
        }
        return true;
    }

    validateNickName() {
        if (this.nickNameText.text === '' || this.nickNameText.text === 'your name') {
            this.errorText.text = "please enter your name";
            return false;
        } else {
            this.errorText.text = "";
        }
        return true;
    }
}

var CreateDialog = function (scene: any) {

    const dialogwidth = 180;
    const dialogheight = 120;


    

    var dialog = scene.rexUI.add.dialog({
        background: scene.add.container(0, 0, [
            scene.rexUI.add.roundRectangle(0, 0, dialogwidth, dialogheight, 1, 0x000000).setAlpha(0.5),
            scene.add.image(0, 0, 'frame').setOrigin(0.5, 0.5).setDisplaySize(dialogwidth, dialogheight)
        ]),

        title: scene.add.container(0, 0, [
            scene.rexUI.add.roundRectangle(0, -30, dialogwidth, 50, 1, 0x000000).setAlpha(0.75),
            scene.add.image(0, -30, 'frame').setOrigin(0.5, 0.5).setDisplaySize(dialogwidth, 50),
            scene.add.text(0, -30, 'Join A Room', {
                fontSize: '18px',
                fontFamily: "DTSubTitleFontFamily",
                color: '#bdced4',
                align: 'center',
            }).setOrigin(0.5, 0.5)
        ]),

        content: new DTTextInput(scene, 0, 0, "enter room id").setStyle(TextStyles.H5),

        actions: [
            CreateLabel(scene, 'Yes'),
            CreateLabel(scene, 'No')
        ],

        space: {
            title: 0,
            content: 20,
            action: 0,

            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
        },

        align: {
            actions: 'center', // 'center'|'left'|'right'
        },

        expand: {
            content: false,  // Content is a pure text object
        }
    })
        .on('button.over', function (button: { getElement: (arg0: string) => { (): any; new(): any; setStrokeStyle: { (arg0: number, arg1: number): void; new(): any; }; }; }, groupName: any, index: any, pointer: any, event: any) {
            // button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button: { getElement: (arg0: string) => { (): any; new(): any; setStrokeStyle: { (): void; new(): any; }; }; }, groupName: any, index: any, pointer: any, event: any) {
            // button.getElement('background').setStrokeStyle();
        });

    return dialog;
}

var CreateLabel = function (scene: any, text: string) {
    return scene.rexUI.add.label({
        // width: 40,
        // height: 40,

        background: scene.add.image(0, -10, 'buttonFrame'),

        text: scene.add.text(0, -10, text, {
            fontSize: '24px'
        }),

        space: {
            left: 30,
            right: 30,
            top: 10,
            bottom: 10
        }
    });
}