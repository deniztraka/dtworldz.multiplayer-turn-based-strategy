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
import { LobbyClient } from "../models/lobbyClient";

export class LobbyScene extends Phaser.Scene {
    room: Room | undefined;
    clients: { [sessionId: string]: any } = {};

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    chatBox: Phaser.GameObjects.Text | undefined;

    titleText: any;
    subTitleText: any;
    brandText: any;
    roomIdText: DTLabel;

    heroImages: any;
    heroIcons: any;

    localClient: any;

    startButton: DTButton;
    startGame: boolean;
    lobbyClientList: LobbyClient[] = [];

    currentPlayerImage: Phaser.GameObjects.Image;
    isReadyImage: Phaser.GameObjects.Image;

    constructor() {
        super({ key: "LobbyScene" })

    }

    init(data: { room: Room, playerName: string }) {

        this.room = data.room;
        this.heroImages = {
            0: 'hero0',
            1: 'hero1',
            2: 'hero2',
            3: 'hero3'
        };
        this.heroIcons = {
            0: 'heroIcon0',
            1: 'heroIcon1',
            2: 'heroIcon2',
            3: 'heroIcon3'
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
                this.localClient = client;

                this.addChangeCharacterButton(client);
                this.addReadyButton(client);
                this.addPlayerName(client);
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
            if (message.canBeStarted) {
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

        this.titleText = new DTLabel(this, this.scale.width / 2, 50, "Exiles of Lowlands").setStyle(TextStyles.H1).setColor("#E8D9A1");
        this.subTitleText = new DTLabel(this, this.scale.width / 2, 110, "The Darkening Mists").setStyle(TextStyles.H4).setColor("#B4AA83");
        this.brandText = new DTLabel(this, this.scale.width / 2, this.scale.height - 25, "DTWorldz").setStyle(TextStyles.H4).setColor("#E8D9A1").setAlpha(0.25);
        this.add.existing(this.titleText);
        this.add.existing(this.subTitleText);
        this.add.existing(this.brandText);
        /** General UI Branding Ends **/

        /** Room Id **/
        this.roomIdText = new DTLabel(this, this.scale.width / 2, this.scale.height - 60, "" + this.room.id).setStyle(TextStyles.BodyText).setColor("#E8D9A1");
        this.add.existing(this.roomIdText);
        let buttonRoomId = new Button(this.roomIdText, {
            clickInterval: 100,
            mode: 1,
        })
            .on('click', function (button: any, gameObject: any, pointer: any, event: any) {
                scene.copyRoomIdToClipboard();
                scene.roomIdText.setText("Copied!")
            }).on('over', function (button: any, gameObject: any, pointer: any, event: any) {
                scene.roomIdText.setText("Copy RoomId: " + scene.room.id)
            }).on('out', function (button: any, gameObject: any, pointer: any, event: any) {
                scene.roomIdText.setText(scene.room.id)
            })

        /** Start Button **/
        this.startGame = false;
        this.startButton = new DTButton(this, this.scale.width / 2, this.scale.height  - 92, "START GAME", this.onStartClicked.bind(this)).setStyle(TextStyles.BodyText).setAlpha(0);
        this.startButton.disableInteractive();

        this.add.existing(this.startButton);
    }

    addPlayerName(client: any) {
        this.add.text(this.scale.width / 2 - 140, this.scale.height / 2 + 200, client.name, TextStyles.H5).setOrigin(0.5, 0.5).setColor("#cccccc").setAlpha(0.75);
    }

    addChangeCharacterButton(client: any) {
        let scene: any = this;
        this.currentPlayerImage = this.add.image(this.scale.width / 2 - 140, this.scale.height / 2 + 110, this.heroImages[client.charIndex]).setDisplaySize(256, 256);

        let button = new Button(this.currentPlayerImage, {
            clickInterval: 100,
            mode: 1
        })
            .on('click', function (button: any, gameObject: any, pointer: any, event: any) {
                scene.setPlayerCharacter();
            })
    }

    addReadyButton(client: any) {
        let scene: any = this;
        this.isReadyImage = this.add.image(this.scale.width / 2 - 140, this.scale.height / 2 + 240, client.isReady ? 'ready' : 'notready').setDisplaySize(25, 25).setAlpha(0.75);
        let isReadyButton = new Button(this.isReadyImage, {
            clickInterval: 100,
            mode: 1
        }).on('click', function (button: any, gameObject: any, pointer: any, event: any) {
            scene.setPlayerReady()
        })
    }

    copyRoomIdToClipboard() {
        navigator.clipboard.writeText(this.room.id)
            .then(() => {
                console.log('RoomId copied to clipboard');
            })
            .catch((error) => {
                console.error('Failed to copy RoomId to clipboard', error);
            });
    }

    onStartClicked() {
        this.startGame = !this.startGame;
        this.room.send('startGame', { startGame: this.startGame });
    }

    refreshPlayerList() {
        let offset = 50;
        const clientPositions = this.calculateClientPositions();

        for (let index = 0; index < this.lobbyClientList.length; index++) {
            let element = this.lobbyClientList[index] as any;
            element.destroy();
        }

        let counter = 0
        for (const sessionId in this.clients) {
            if (Object.prototype.hasOwnProperty.call(this.clients, sessionId)) {
                const client = this.clients[sessionId];

                if (this.room.sessionId === sessionId) {
                    continue;
                }

                const clientPosition = clientPositions[counter];
                this.lobbyClientList.push(new LobbyClient(this, client, clientPosition + offset, 150));
                counter++;
            }
        }
    }

    calculateClientPositions() {
        const clientWidth = 100;
        const screenWidth = this.scale.width;
        const clientCount = Object.keys(this.clients).length - 1;
        const totalClientsWidth = clientCount * clientWidth;
        const startingX = (screenWidth / 2) - (totalClientsWidth / 2);

        const clientPositions = [];
        let currentX = startingX;

        for (let i = 0; i < clientCount; i++) {
            clientPositions.push(currentX);
            currentX += clientWidth;
        }

        return clientPositions;
    }

    setPlayerReady() {
        this.localClient.isReady = !this.localClient.isReady;
        this.isReadyImage.setTexture(this.localClient.isReady ? 'ready' : 'notready');
        this.room.send('isReady', { isReady: this.localClient.isReady });
        this.refreshPlayerList();
    }

    setPlayerCharacter() {
        //change charIndex between 0 and the length of heroImages
        this.localClient.charIndex = (this.localClient.charIndex + 1) % Object.keys(this.heroImages).length;
        this.currentPlayerImage.setTexture(this.heroImages[this.localClient.charIndex]);
        this.room.send('charIndex', { charIndex: this.localClient.charIndex });
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