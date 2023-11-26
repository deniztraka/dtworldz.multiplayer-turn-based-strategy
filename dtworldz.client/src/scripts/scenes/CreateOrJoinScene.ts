import Phaser from "phaser";


import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../../backend";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from './../utils/ui/textStyles';
import { DTTextInput } from "../utils/ui/dtTextInput";
import { DTDrowpDownList } from "../utils/ui/dtDrowpDownList";
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
        this.load.image('loginBackground', '/assets/images/bgWide.png');
        this.load.image('logo', '/assets/images/logo.png');
        this.load.image('buttonFrame', '/assets/images/buttonFrame.png');
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        this.createBackground(); 
        this.createNickNameInput();
        this.createButtons();

        this.errorText = new DTLabel(this, this.scale.width / 2, this.scale.height / 2, "")
            .setStyle(TextStyles.H4)
            .setColor("#ffffff");
        this.add.existing(this.errorText);
    }

    createButtons() {
        const scene: any = this;

        const createText = scene.add.text(0, -3, "CREATE", {
            fontSize: '26px',
            fontFamily: "DTBodyFontFamily",
            color: '#dcd9ce',
            fixedWidth: 160,
            fixedHeight: 45,
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            }
        })
            .setOrigin(0.5, 0.5)
            .setAlign('center')
            .setAlpha(0.5);

        new Button(this.add.container(this.scale.width / 2, this.scale.height / 2 + 100, [
            scene.rexUI.add.roundRectangle(0, 0, 150, 60, {
                x: 10,
                y: 10
            }, 0x000000),
            scene.add.image(0, 0, 'buttonFrame')
                .setOrigin(0.5, 0.5),
            createText
        ]).setSize(180, 50), {
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


        const joinText = scene.add.text(0, -3, "JOIN", {
            fontSize: '26px',
            fontFamily: "DTBodyFontFamily",
            color: '#dcd9ce',
            fixedWidth: 160,
            fixedHeight: 45,
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            }
        })
            .setOrigin(0.5, 0.5)
            .setAlign('center')
            .setAlpha(0.5);

        new Button(this.add.container(this.scale.width / 2, this.scale.height / 2 + 180, [
            scene.rexUI.add.roundRectangle(0, 0, 150, 60, {
                x: 10,
                y: 10
            }, 0x000000),
            scene.add.image(0, 0, 'buttonFrame')
                .setOrigin(0.5, 0.5),
            joinText
        ]).setSize(180, 50), {
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
        this.add.image(this.scale.width / 2, 0, 'logo')
            .setOrigin(0.5, 0)
    }

    createNickNameInput() {
        const scene: any = this;
        let initialText = 'your name';
        this.add.container(this.scale.width / 2, this.scale.height / 2 - 100, [
            scene.rexUI.add.roundRectangle(0, 0, 200, 60, {
                x: 10,
                y: 10
            }, 0x000000).setAlpha(0.6),
            this.add.image(0, 0, 'buttonFrame')
                .setOrigin(0.5, 0.5).setDisplaySize(240, 60)
        ])
        this.nickNameText = scene.add.text(this.scale.width / 2, this.scale.height / 2 - 100, initialText, {
            fontSize: '22px',
            fontFamily: "DTBodyFontFamily",
            color: '#ffffff',
            fixedWidth: 160,
            fixedHeight: 45,
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            align: 'center',
        }).setOrigin(0.5, 0.5).setAlpha(0.5)

        let editorConfig = {
            type: 'text',
            enterClose: true,
            selectAll: true,

            // onOpen: function (textObject: any) {

            // },
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
        //this.errorText.text = "connecting to the server...";

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








    var dialog = scene.rexUI.add.dialog({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 1, 0xC3B68D),

        title: scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 1, 0x333333),
            text: scene.add.text(0, 0, 'Join a lobby', {
                fontSize: '24px'
            }),
            space: {
                left: 15,
                right: 15,
                top: 10,
                bottom: 10
            }
        }),

        content: new DTTextInput(scene, 0, 0, "enter room id").setStyle(TextStyles.H5),

        actions: [
            CreateLabel(scene, 'Yes'),
            CreateLabel(scene, 'No')
        ],

        space: {
            title: 25,
            content: 100,
            action: 15,

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
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button: { getElement: (arg0: string) => { (): any; new(): any; setStrokeStyle: { (): void; new(): any; }; }; }, groupName: any, index: any, pointer: any, event: any) {
            button.getElement('background').setStrokeStyle();
        });

    return dialog;
}

var CreateLabel = function (scene: {
    rexUI: {
        add: {
            label: (arg0: {
                // width: 40,
                // height: 40,
                background: any; text: any; space: { left: number; right: number; top: number; bottom: number; };
            }) => any; roundRectangle: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number) => any;
        };
    }; add: { text: (arg0: number, arg1: number, arg2: any, arg3: { fontSize: string; }) => any; };
}, text: string) {
    return scene.rexUI.add.label({
        // width: 40,
        // height: 40,

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, 0x666666),

        text: scene.add.text(0, 0, text, {
            fontSize: '24px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}