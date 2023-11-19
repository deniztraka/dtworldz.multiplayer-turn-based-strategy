import Phaser from "phaser";


import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../../backend";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from './../utils/ui/textStyles';
import { DTTextInput } from "../utils/ui/dtTextInput";
import { DTButton } from "../utils/ui/dtButton";
import { DTDrowpDownList } from "../utils/ui/dtDrowpDownList";
import { DTDialog } from "../utils/ui/dtDialog";

export class CreateOrJoinScene extends Phaser.Scene {
    room: Room | undefined;
    nickNameText: DTTextInput;
    titleText: DTLabel;
    brandText: DTLabel;
    createButton: DTButton;
    dropdownList: DTDrowpDownList;
    joinButton: DTButton;
    maxPlayerCount: any;
    joinDialog: DTDialog;
    errorText: DTLabel;
    roomId: any;
    subTitleText: DTLabel;

    constructor() {
        super({ key: "CreateOrJoinScene" });
    }

    preload() {
        // update menu background color
        this.load.image('loginBackground', '/assets/images/loginBackground.png');
        this.cameras.main.setBackgroundColor(0x000000);
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        //this.scene.start('LobbyScene', { room: this.room, playerName: 'deniz' });

        this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5)
            .setAlpha(0.2)
            .setDisplaySize(this.scale.width, this.scale.height);


        this.titleText = new DTLabel(this, this.scale.width / 2, 50, "Exiles of Lowlands").setStyle(TextStyles.H1).setColor("#E8D9A1");
        this.subTitleText = new DTLabel(this, this.scale.width / 2, 110, "The Darkening Mists").setStyle(TextStyles.H4).setColor("#B4AA83");
        this.brandText = new DTLabel(this, this.scale.width / 2, this.scale.height - 25, "DTWorldz").setStyle(TextStyles.H4).setColor("#E8D9A1").setAlpha(0.25);

        this.add.existing(this.titleText);
        this.add.existing(this.subTitleText);
        this.add.existing(this.brandText);

        this.nickNameText = new DTTextInput(this, this.scale.width / 2, 300, "your name?").setStyle(TextStyles.BodyText);
        this.dropdownList = new DTDrowpDownList(this, this.scale.width / 2, 340, 'max players ?', [
            { text: '2 players', value: 2 },
            { text: '3 players', value: 3 },
            { text: '4 players', value: 4 },
            { text: '5 players', value: 5 },
        ], this.onMaxPlayerCountSelected.bind(this));
        this.createButton = new DTButton(this, this.scale.width / 2, 400, "CREATE", this.onCreateClicked.bind(this)).setStyle(TextStyles.BodyText).setAlpha(0.75);;
        this.joinButton = new DTButton(this, this.scale.width / 2, 440, " JOIN ", this.onJoinClicked.bind(this)).setStyle(TextStyles.BodyText).setAlpha(0.75);


        this.add.existing(this.nickNameText);
        this.add.existing(this.createButton);
        this.add.existing(this.joinButton);

        this.errorText = new DTLabel(this, this.scale.width / 2, 600, "")
            .setStyle(TextStyles.H5)
            .setColor("#ff0000");
        this.add.existing(this.errorText);

    }

    async onCreateClicked() {

        if (!this.validateNickName() || !this.validatePlayerCount()) {
            return;
        }

        await this.connect(this.nickNameText.text);
        console.log("room: ", this.room.id);
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

    onMaxPlayerCountSelected(selectedObj: any) {
        this.maxPlayerCount = selectedObj.value;
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
                this.room = await client.create("dtworldz", { clientName: clientName, maxPlayers: this.maxPlayerCount });
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
        if (this.nickNameText.text === '' || this.nickNameText.text === 'your name?') {
            this.errorText.text = "please enter your name";
            return false;
        } else {
            this.errorText.text = "";
        }
        return true;
    }

    validatePlayerCount() {
        if (this.maxPlayerCount === undefined) {
            this.errorText.text = "please select max players";
            return false;
        } else {
            this.errorText.text = "";
        }
        return true;
    }
}

var CreateDialog = function (scene: any) {


    // let contentText = scene.add.text(0, 0, 'Please enter the id of the room', {
    //     fontSize: '24px',
    //     color: '#333333',
    // })


    let textInput = new DTTextInput(scene, 0, 0, "enter room id").setStyle(TextStyles.H5)
        .setColor("#333333")
        .setBackgroundColor("#999999")





    var dialog = scene.rexUI.add.dialog({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 1, 0xcccccc),

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

        content: textInput,

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
    scene.add.existing(textInput);
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