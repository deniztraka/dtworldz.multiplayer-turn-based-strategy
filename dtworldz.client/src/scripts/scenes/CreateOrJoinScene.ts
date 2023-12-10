import Phaser from "phaser";

import { Room, Client } from "colyseus.js";
import { BACKEND_URL, API_URL } from "../../backend";
import { DTLabel } from "../utils/ui/dtLabel";
import { DTTextInput } from "../utils/ui/dtTextInput";
import { DTButton } from "../utils/ui/dtButton";
import Anchor from "phaser3-rex-plugins/plugins/anchor";
import wretch from "wretch"

export class CreateOrJoinScene extends Phaser.Scene {
    room: Room | undefined;
    nickNameText: any;
    errorText: DTLabel;
    roomId: any;
    api: any;


    constructor() {
        super({ key: "CreateOrJoinScene" });
    }

    preload() {
        this.load.image('loginBackground', '/assets/images/bg.png');
        this.load.image('logo', '/assets/images/logo.png');
        this.load.image('frame', '/assets/images/frame.png');
        this.load.image('buttonFrame', '/assets/images/buttonFrame-lowRes.png');
        this.load.image('ready', '/assets/images/ready.png');
        this.load.image('notready', '/assets/images/notready.png');
        this.load.image('readyButon', '/assets/images/readyButton.png');
        this.load.image('char0', '/assets/images/characters/char0.png');
        this.load.image('char1', '/assets/images/characters/char1.png');
        this.load.image('char2', '/assets/images/characters/char2.png');
        this.load.image('char3', '/assets/images/characters/char3.png');
        this.load.image('char4', '/assets/images/characters/char4.png');
        this.load.image('charIcon0', '/assets/images/characters/charIcon0.png');
        this.load.image('charIcon1', '/assets/images/characters/charIcon1.png');
        this.load.image('charIcon2', '/assets/images/characters/charIcon2.png');
        this.load.image('charIcon3', '/assets/images/characters/charIcon3.png');
        this.load.image('charIcon4', '/assets/images/characters/charIcon4.png');
        this.load.image('mainCharFrame', '/assets/images/mainCharFrame.png');
        this.load.image('mainCharFrameBG', '/assets/images/mainCharFrameBG.png');
        this.load.image('characterPanelBarBG', '/assets/images/characterPanelBarBG.png');
        this.load.image('characterPanelBar', '/assets/images/characterPanelBar.png');
        this.load.spritesheet('char', '/assets/images/characters/charsSheet.png', { frameWidth: 32, frameHeight: 64 });

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

        // Instantiate and configure wretch
        this.api =
        wretch(API_URL, { mode: "cors" })
        .errorType("json")
        .resolve(r => r.json())

    }

    create() {
        this.createUI();
    }

    createUI() {
        this.createBackground();
        this.createNickNameInput();
        this.createButtons();

        this.errorText = new DTLabel(this, 0, 0, "       ", null, { centerX: 'center', bottom: '60%' })
            .setColor("#ffffff");
    }

    createButtons() {
        const joinButton = new DTButton(this, 0, 0, " JOIN ", () => {
            this.onJoinClicked();
        }, { bottom: '72%', centerX: 'center' }).setScale(1.5);

        const createButton = new DTButton(this, 0, 0, "CREATE", () => {
            this.onCreateClicked();
        }, { bottom: '65%', centerX: 'center' }).setScale(1.5);
    }

    createBackground() {

        new Anchor(this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5).setAlpha(0.75), { centerY: 'center', centerX: 'center' })
            new Anchor(this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo')
            .setOrigin(0.5, 0.5).setScale(1.5).setTint(0xbdced6), { top: '5%', centerX: 'center' })
    }

    createNickNameInput() {
        const scene: any = this;
        this.nickNameText = new DTTextInput(this, 0, 0, "your name?", {}, {
            centerX: 'center', centerY: 'center'
        }).setScale(1.5)

        // scene.input.keyboard.on('keydown', function (event: any) {
        //     if (event.key === "Enter") {
        //         if (scene.validateNickName()) {
        //             scene.onCreateClicked();
        //         } else {
        //             console.log("invalid name")
        //             // @ts-ignore: Unreachable code error
        //             scene.nickNameText.openEditor();
        //         }
        //     } else if (event.key === "Escape") {
        //         scene.validateNickName()
        //         // @ts-ignore: Unreachable code error
        //         scene.nickNameText.closeEditor();
        //     }
        // });
        // return;
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
        this.errorText.setText("connecting to the server...");

        const client = new Client(BACKEND_URL);

        try {
            const characters = await this.api.get("/characters");

            if(characters.length === 0) {
                return;
            }

            // if room id is provided, join the room
            if (roomId) {
                this.room = await client.joinById(roomId, { clientName: clientName });
            } else {
                this.room = await client.create("dtworldz", { clientName: clientName, maxPlayers: 5 });
            }
            
            this.scene.start('LobbyScene', { room: this.room, playerName: clientName, characters: characters });

        } catch (e: any) {
            // couldn't connect
            this.errorText.setText(e.message);
        }
    }

    validateRoomId(roomId: string) {
        if (roomId === 'enter room id') {
            this.errorText.setText("please enter room id");
            return false;
        } else {
            this.errorText.setText("");
        }
        return true;
    }

    validateNickName() {
        if (this.nickNameText.text === '' || this.nickNameText.text === 'your name?') {
            this.errorText.setText("please enter your name");
            return false;
        } else {
            this.errorText.setText("");
        }
        return true;
    }
}

var CreateDialog = function (scene: any) {

    const dialogwidth = 320;
    const dialogheight = 360;




    var dialog = scene.rexUI.add.dialog({
        background: scene.add.container(0, 0, [
            scene.rexUI.add.roundRectangle(0, 0, dialogwidth - 10, dialogheight - 10, 1, 0x000000).setAlpha(0.5).setStrokeStyle(2, 0x999999),
            // scene.add.image(0, 0, 'frame').setOrigin(0.5, 0.5).setDisplaySize(dialogwidth, dialogheight)
        ]),

        title: scene.add.container(0, 0, [
            // scene.rexUI.add.roundRectangle(0, 0, dialogwidth- 10, 50, 1, 0x000000).setAlpha(0.75).setOrigin(0.5, 0.5),
            // scene.add.image(0, 0, 'frame').setOrigin(0.5, 0.5).setDisplaySize(dialogwidth, 50).setOrigin(0.5, 0.5),
            scene.add.text(0, 0, 'Join A Room', {
                fontSize: '28px',
                fontFamily: "DTSubTitleFontFamily",
                color: '#bdced4',
                align: 'center',
            }).setOrigin(0.5, 0.5)
        ]),

        content: new DTTextInput(scene, 0, 0, "room id", {
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, {
                x: 1,
                y: 1
            }, 0x666666).setAlpha(0.5).setStrokeStyle(2, 0x999999),
        }),

        actions: [
            CreateLabel(scene, 'Yes'),
            CreateLabel(scene, 'No')
        ],

        space: {
            title: 100,
            content: 100,
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

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 1, 0x333333).setAlpha(0.5).setStrokeStyle(2, 0x666666).setScale(0.7),

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