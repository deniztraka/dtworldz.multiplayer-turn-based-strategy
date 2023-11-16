import Phaser from "phaser";
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';
import Button from 'phaser3-rex-plugins/plugins/button.js';
import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../../backend";

export class CreateOrJoinScene extends Phaser.Scene {
    room: Room | undefined;

    constructor() {
        super({ key: "CreateOrJoinScene" });
    }

    preload() {
        // update menu background color
        this.cameras.main.setBackgroundColor(0x000000);
    }

    create() {
        var inputText = new InputText(this, this.scale.width / 2, this.scale.height / 2 - 200, 150, 50, {
            type: 'text',
            text: '',
            fontSize: '24px',
            color: '#000000',
            backgroundColor: '#cccccc',
            align: 'center',
            border: 3,
            placeholder: 'your name?',
            fontFamily: 'Arial',
        });
        this.add.existing(inputText);

        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            color: "#000000",
            fontSize: "32px",
            fontFamily: 'Arial',
            backgroundColor: "#ffffff",
            padding: {
                left: 40,
                right: 40,
                top: 5,
                bottom: 5,
            }
        };

        var createButtonText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, "CREATE", textStyle);
        createButtonText.setOrigin(0.5, 0.5);

        var button = new Button(createButtonText, {
            enable: true,
            mode: 1,              // 0|'press'|1|'release'
            clickInterval: 100    // ms
        });

        button.on('click', async () => {

            if (inputText.text === '') {
                return;
            }

            await this.connect(inputText.text);
            console.log("room: ", this.room.id);
        });

        var roomIdInput = new InputText(this, this.scale.width / 2, this.scale.height / 2 + 100, 150, 50, {
            type: 'text',
            text: '',
            fontSize: '24px',
            color: '#000000',
            backgroundColor: '#cccccc',
            align: 'center',
            border: 3,
            placeholder: 'roomID?',
            fontFamily: 'Arial',
        });
        this.add.existing(roomIdInput);

        var joinButtonText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 200, "JOIN", textStyle);
        joinButtonText.setOrigin(0.5, 0.5);

        var joinButton = new Button(joinButtonText, {
            enable: true,
            mode: 1,              // 0|'press'|1|'release'
            clickInterval: 100    // ms
        });

        joinButton.on('click', async () => {
            if (roomIdInput.text === '') {
                return;
            }

            await this.connect(inputText.text, roomIdInput.text);
            console.log("room ", this.room.id);
        });
    }

    async connect(clientName: string, roomId?: string) {
        // add connection status text
        const connectionStatusText = this.add
            .text(0, 0, "Trying to connect with the server...")
            .setStyle({ color: "#ff0000" })
            .setPadding(4)

        const client = new Client(BACKEND_URL);

        try {
            // if room id is provided, join the room
            if (roomId) {
                this.room = await client.joinById(roomId, { clientName: clientName });
            } else {
                this.room = await client.create("dtworldz", { clientName: clientName });
            }

            // connection successful!
            connectionStatusText.destroy();

            this.scene.start('LobbyScene', {room: this.room, playerName: clientName});

        } catch (e) {
            // couldn't connect
            connectionStatusText.text = "Could not connect with the server.";
        }
    }
}