import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from './../utils/ui/textStyles';
import Button from 'phaser3-rex-plugins/plugins/button.js';
import { LobbyClient } from "../models/lobbyClient";
import { LobbyChatPanel } from "../utils/ui/lobbyChatPanel";

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

    startButton: Button;
    startGame: boolean;
    lobbyClientList: LobbyClient[] = [];

    currentPlayerImage: Phaser.GameObjects.Image;
    isReadyImage: Phaser.GameObjects.Image;
    chatPanel: LobbyChatPanel;
    readyText: any;

    constructor() {
        super({ key: "LobbyScene" })
        this.localClient = {};

    }

    init(data: { room: Room, playerName: string }) {

        this.room = data.room;
        this.heroImages = {
            0: 'char0',
            1: 'char1',
            2: 'char2',
            3: 'char3',
            4: 'char4',
        };
        this.localClient = {
            name: data.playerName,
            isReady: false,
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
        this.load.image('mainCharFrame', '/assets/images/mainCharFrame.png');
        this.load.image('characterPanelBarBG', '/assets/images/characterPanelBarBG.png');
        this.load.image('characterPanelBar', '/assets/images/characterPanelBar.png');
        this.load.image('turnSign', '/assets/images/turnSign.png');
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
                this.createReadyButton();
                this.chatPanel = new LobbyChatPanel(this, this.scale.width / 2, this.scale.height / 2 - 60);
            }

            this.attachClientEvents(client, sessionId);
            this.refreshPlayerList();

        });

        this.room.onMessage('chat', (message) => {
            this.chatPanel.addEntry(message.sender, message.text);
        });

        this.room.onMessage('canBeStarted', (message) => {
            if (message.canBeStarted) {
                this.startButton.enable = true;
                this.readyText.setAlpha(0.75);
            } else {
                this.startButton.enable = false;
                this.readyText.setAlpha(0.25);
            }
        });

        this.room.onMessage('loadGame', (message) => {
            this.scene.transition({
                target: 'GameLoadingScene',
                data: { room: this.room, clients: this.clients, localClient: this.localClient },
                // moveAbove: false,
                // moveBelow: false,

                duration: 1000,

                remove: true,
                // sleep: false,
                allowInput: false,

                // onStart: null,
                // onStartScope: scene,

                // onUpdate: null,
                // onUpdateScope: scene,
            })

            //this.scene.start('GameLoadingScene', { room: this.room, clients: this.clients, localClient: this.localClient });
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

        this.createBackground();

        this.createRoomIdButton();

    }

    createReadyButton() {

        if (!this.clients[this.room.sessionId].isOwner) {
            return;
        }

        let scene: any = this;
        /** Start Button **/
        this.startGame = false;
        // this.startButton = new DTButton(this, this.scale.width / 2, this.scale.height - 92, "START GAME", this.onStartClicked.bind(this)).setStyle(TextStyles.BodyText).setAlpha(0);
        // this.startButton.disableInteractive();

        //this.add.existing(this.startButton);
        this.readyText = scene.add.text(0, 0, "START", {
            fontFamily: 'DTBodyFontFamily',
            fontSize: '20px',
            align: 'center',
            fixedWidth: 0,
            fixedHeight: 0,
            padding: {
                left: 40,
                right: 40,
                top: 5,
                bottom: 5,
            }
        }).setOrigin(0.5, 0.5).setColor("#ffffff").setAlpha(0.25);

        this.startButton = new Button(this.add.container(this.scale.width / 2 + 175, this.scale.height - 200, [
            scene.add.image(0, 50, 'readyButon')
                .setOrigin(0.5, 0.5)
            , scene.readyText
        ]).setSize(180, 50), {
            enable: true,
            mode: 1,              // 0|'press'|1|'release'
            clickInterval: 100,    // ms
            threshold: undefined
        })
            .on('click', function (button: any, gameObject: any, pointer: any, event: any) {
                scene.onStartClicked()
            }).on('over', function (button: any, gameObject: any, pointer: any, event: any) {
                if (button.enable) {
                    scene.readyText.setAlpha(1);
                } else {
                    scene.readyText.setAlpha(0.25);
                }
            }).on('out', function (button: any, gameObject: any, pointer: any, event: any) {
                if (button.enable) {
                    scene.readyText.setAlpha(0.5);
                } else {
                    scene.readyText.setAlpha(0.25);
                }
            });

        this.startButton.enable = false;
    }

    createRoomIdButton() {
        let scene: any = this;
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
    }

    createBackground() {
        const scene: any = this;
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5)
        this.add.image(this.scale.width / 2, 0, 'logo')
            .setOrigin(0.5, 0)
    }

    addPlayerName(client: any) {
        this.add.text(this.scale.width / 2 - 180, this.scale.height - 375, client.name, TextStyles.H3).setOrigin(0.5, 0.5).setColor("#feffcc").setAlpha(1);
    }

    addChangeCharacterButton(client: any) {
        let scene: any = this;

        this.currentPlayerImage = this.add.image(this.scale.width / 2 - 180, this.scale.height - 230, this.heroImages[client.charIndex]);

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
        this.isReadyImage = this.add.image(this.scale.width / 2 - 180, this.scale.height - 75, client.isReady ? 'ready' : 'notready').setDisplaySize(35, 35).setAlpha(0.8);
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
        let offset = 125;
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
                this.lobbyClientList.push(new LobbyClient(this, client, clientPosition + offset, this.scale.height - 230));
                counter++;
            }
        }
    }

    calculateClientPositions() {
        const clientWidth = 75;
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
}