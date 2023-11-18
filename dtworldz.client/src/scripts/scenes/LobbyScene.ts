import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from './../utils/ui/textStyles';
import hero0Url from "../../../assets/images/characters/hero0.png";
import hero1Url from "../../../assets/images/characters/hero1.png";
import hero2Url from "../../../assets/images/characters/hero2.png";
import hero3Url from "../../../assets/images/characters/hero3.png";
import heroIcon0Url from "../../../assets/images/characters/heroIcon0.png";
import heroIcon1Url from "../../../assets/images/characters/heroIcon1.png";
import heroIcon2Url from "../../../assets/images/characters/heroIcon2.png";
import heroIcon3Url from "../../../assets/images/characters/heroIcon3.png";
import Button from 'phaser3-rex-plugins/plugins/button.js';
import { DTButton } from "../utils/ui/dtButton";

export class LobbyScene extends Phaser.Scene {
    room: Room | undefined;
    clients: { [sessionId: string]: any } = {};

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    playerName: string;
    chatBox: Phaser.GameObjects.Text | undefined;
    titleText: any;
    subTitleText: any;
    brandText: any;
    roomIdText: DTLabel;
    gridSizer: any;
    heroImages: any;
    currentPlayerImage: Phaser.GameObjects.Image;
    charIndex: number;
    isReadyImage: Phaser.GameObjects.Image;
    currentClient: any;
    startButton: DTButton;
    startGame: boolean;

    constructor() {
        super({ key: "LobbyScene" });

    }

    init(data: { room: Room, playerName: string }) {
        this.playerName = data.playerName;
        this.room = data.room;
        this.heroImages = {
            0: 'hero0',
            1: 'hero1',
            2: 'hero2',
            3: 'hero3'
        };
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.image('ready', '/assets/images/ready.png');
        this.load.image('notready', '/assets/images/notready.png');
        this.load.image('hero0', hero0Url);
        this.load.image('hero1', hero1Url);
        this.load.image('hero2', hero2Url);
        this.load.image('hero3', hero3Url);
        this.load.image('heroIcon0', heroIcon0Url);
        this.load.image('heroIcon1', heroIcon1Url);
        this.load.image('heroIcon2', heroIcon2Url);
        this.load.image('heroIcon3', heroIcon3Url);
    }

    create() {
        this.createLobbyUI();
        this.attachRoomEvents();
    }

    attachRoomEvents() {

        this.room.state.players.onAdd((client: any, sessionId: any) => {
            this.clients[sessionId] = client;

            // set currentClient if room id and session id matches
            if (this.room.sessionId === sessionId) {
                this.currentClient = client;
            }

            this.attachClientEvents(client, sessionId);
            this.refreshPlayerList();
        });

        this.room.onMessage('chat', (message) => {
            console.log('Received chat message: ', message.text);
            // new message received from server
            //this.updateChatBox(`${message.sender}: ${message.text}`);
        });

        this.room.onMessage('canBeStarted', (message) => {
            if(message.canBeStarted){
                this.startButton.setAlpha(1).setInteractive();
            } else {
                this.startButton.setAlpha(0.25).disableInteractive();
            }
        });

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((_client: any, sessionId: any) => {
            console.log(`${sessionId} is removed`);
            const client = this.clients[sessionId]

            if (client) {
                delete this.clients[sessionId]
                this.refreshPlayerList();
            }
        });
    }

    attachClientEvents(client: any, sessionId: any) {
        // listen to patches coming from the server for isReady property
        client.listen('isReady', (isReady: boolean) => {
            this.refreshPlayerList();
        });
        client.listen('charIndex', (charIndex: number) => {
            this.refreshPlayerList();
        });
    }

    createLobbyUI() {

        let scene: any = this;

        /** General UI Branding Starts **/
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5)
            .setAlpha(0.2)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.titleText = new DTLabel(this, this.scale.width / 2, 100, "Exiles of Lowlands").setStyle(TextStyles.H1).setColor("#E8D9A1");
        this.subTitleText = new DTLabel(this, this.scale.width / 2, 160, "The Darkening Mists").setStyle(TextStyles.H4).setColor("#B4AA83");
        this.brandText = new DTLabel(this, this.scale.width / 2, this.scale.height - 50, "DTWorldz").setStyle(TextStyles.H4).setColor("#E8D9A1").setAlpha(0.25);
        this.add.existing(this.titleText);
        this.add.existing(this.subTitleText);
        this.add.existing(this.brandText);
        /** General UI Branding Ends **/

        /** Room Id **/
        this.roomIdText = new DTLabel(this, this.scale.width / 2, 550, "RoomId: " + this.room.id).setStyle(TextStyles.BodyText).setColor("#E8D9A1");
        this.add.existing(this.roomIdText);

        /** Player List Table Content **/
        this.refreshPlayerList();

        /** Current Player Content **/
        this.charIndex = Math.floor(Math.random() * Object.keys(this.heroImages).length);
        this.currentPlayerImage = this.add.image(this.scale.width / 2 - 100, this.scale.height / 2 - 100, this.heroImages[this.charIndex]);

        let button = new Button(this.currentPlayerImage, {
            clickInterval: 100,
            mode: 1
        })
            .on('click', function (button: any, gameObject: any, pointer: any, event: any) {

                scene.setPlayerCharacter();
            })

        this.isReadyImage = this.add.image(this.scale.width / 2 - 100, this.scale.height / 2 - 50 , 'notready').setDisplaySize(25, 25);
        let isReadyButton = new Button(this.isReadyImage, {
            clickInterval: 100,
            mode: 1
        }).on('click', function (button: any, gameObject: any, pointer: any, event: any) {
            scene.setPlayerReady()
        })

        /** Start Button **/
        this.startGame = false;
        this.startButton = new DTButton(this, this.scale.width / 2, 600, "START GAME", this.onStartClicked.bind(this)).setStyle(TextStyles.BodyText).setAlpha(0.25);
        this.startButton.disableInteractive();

        this.add.existing(this.startButton);
    }

    onStartClicked() {
        this.startGame = !this.startGame;
        this.room.send('startGame', { startGame: this.startGame });
    }

    refreshPlayerList() {
        const x = this.scale.width / 2 - 50;
        const y = this.scale.height / 2 - 175;
        const backgroundColor = 0x000000;
        const alpha = 0.25;

        let scene: any = this;
        if (!this.gridSizer) {
            this.gridSizer = scene.rexUI.add.gridSizer({
                x: x, y: y,
                width: 175, height: undefined,

                column: 3, row: 5,
                columnProportions: [0, 0, 1], rowProportions: 0,
                space: {
                    left: 10, right: 10, top: 10, bottom: 10,
                    column: 5,
                    row: 5
                },
            })
                .setOrigin(0)
                .addBackground(scene.rexUI.add.roundRectangle(0, 0, 1, 1, 0, backgroundColor).setAlpha(alpha));
        }

        this.gridSizer.clear(true);
        for (const key in this.clients) {
            if (Object.prototype.hasOwnProperty.call(this.clients, key)) {
                const client = this.clients[key];
                this.addNewPlayerRow(client);
            }
        }
        scene.gridSizer.setOrigin(0)
            .addBackground(scene.rexUI.add.roundRectangle(0, 0, 1, 1, 0, 0x000000).setAlpha(0.25));
        this.gridSizer.layout();
    }

    addNewPlayerRow(client: any) {
        // Display a colored square based on the player's ready status
        const size = 25; // Size of the square

        const clientCharIndex = client.charIndex !== undefined ? client.charIndex : this.charIndex;
        const playerName = client.name !== undefined ? client.name : this.playerName;
        const isReady = client.isReady !== undefined ? client.isReady : false;

        this.gridSizer.add(
            this.add.image(0, 0, 'heroIcon' + clientCharIndex).setDisplaySize(25, 25),
            { expand: false, align: 'left' }
        )
            .add(
                this.add.text(0, 0, playerName),
                { expand: false, align: 'left' }
            )
            .add(
                this.add.image(0, 0, isReady ? 'ready' : 'notready').setDisplaySize(10, 10),
                { expand: false, align: 'right' }
            )
            .layout();
    }

    

    setPlayerReady() {
        this.currentClient.isReady = !this.currentClient.isReady;
        this.isReadyImage.setTexture(this.currentClient.isReady ? 'ready' : 'notready');
        this.room.send('isReady', { isReady: this.currentClient.isReady });
        this.refreshPlayerList();
    }

    setPlayerCharacter() {
        //change charIndex between 0 and the length of heroImages
        this.currentClient.charIndex = (this.currentClient.charIndex + 1) % Object.keys(this.heroImages).length;
        this.currentPlayerImage.setTexture(this.heroImages[this.currentClient.charIndex]);
        this.room.send('charIndex', { charIndex: this.currentClient.charIndex });
        this.refreshPlayerList();
    }

    createChatUI() {
        // Chat display area
        this.chatBox = this.add.text(400, 50, '').setStyle({ font: '12px Courier', fill: '#00ff00' });
        this.chatBox.setWordWrapWidth(400);
        this.chatBox.setScrollFactor(0);

        // HTML Input Element for chat messages
        this.createChatInput();
    }

    createChatInput() {
        let inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.style.position = 'absolute';
        inputElement.style.bottom = '50px';
        inputElement.style.left = '400px';
        inputElement.style.width = '200px';

        document.body.appendChild(inputElement);
        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.sendChatMessage(inputElement.value);
                inputElement.value = '';
            }
        });
    }

    sendChatMessage(message: string) {
        console.log('Sending chat message: ', message);
        if (message.trim().length === 0) return; // Ignore empty messages

        // Assuming 'this.room' is your Colyseus room instance
        this.room.send('chat', message);
    }

    updateChatBox(text: string) {
        this.chatBox.setText(this.chatBox.text + '\n' + text);
        this.chatBox.scrollFactorY = this.chatBox.height;
    }

}