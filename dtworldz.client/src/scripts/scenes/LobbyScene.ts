import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from './../utils/ui/textStyles';
import Button from 'phaser3-rex-plugins/plugins/button.js';
import { LobbyClient } from "../models/lobbyClient";
import { LobbyChatPanel } from "../utils/ui/lobbyChatPanel";
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';
import { DTButton } from "../utils/ui/dtButton";

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
    chatPanel: LobbyChatPanel;
    playerNameText: any;
    startText: any;

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
        this.load.spritesheet('char', '/assets/images/characters/charsSheet.png', { frameWidth: 32, frameHeight: 32 });
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
                this.createStartButton();

                const currentPlayerContainer = this.add.container(0, 0, [this.currentPlayerImage, this.isReadyImage, this.playerNameText]);
                let anchor = new Anchor(currentPlayerContainer, {
                    left: '18%',
                    bottom: 'bottom-100',
                }).anchor();


                this.chatPanel = new LobbyChatPanel(this);
            }

            this.attachClientEvents(client, sessionId);
            this.refreshPlayerList();

        });

        this.room.onMessage('chat', (message) => {
            this.chatPanel.addEntry(message.sender, message.text);
        });

        this.room.onMessage('canBeStarted', (message) => {
            if (message.canBeStarted) {
                this.startButton.setEnabled(true);
            } else {
                this.startButton.setEnabled(false)
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

    createStartButton() {
        if (!this.clients[this.room.sessionId].isOwner) {
            return;
        }
        /** Start Button **/
        this.startGame = false;

        this.startButton = new DTButton(this, 0, 0, 'START', this.onStartClicked.bind(this),
            { centerX: 'center', bottom: 'bottom-30' }).setEnabled(false).setScale(1);
    }

    createRoomIdButton() {
        let scene: any = this;
        this.roomIdText = new DTLabel(this, 0, 0, this.room.id, {}, {
            centerX: 'center',
            bottom: 'bottom',
        }).setScale(1);


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
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5)
    }

    addPlayerName(client: any) {
        this.playerNameText = this.add.text(0, -200, client.name, {
            fontFamily: 'DTBodyFontFamily',
            fontSize: '18px',
            fixedWidth: 80,
            fixedHeight: 0,
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }
        }).setOrigin(0.5, 0.5).setColor("#fff").setAlpha(1).setScale(1).setAlign('center');
        // let anchor = new Anchor(this.playerNameText, {
        //     left: '5%',
        //     bottom: 'bottom-110',
        // }).anchor();
    }

    addChangeCharacterButton(client: any) {
        let scene: any = this;
        this.currentPlayerImage = this.add.image(0, 0, this.heroImages[client.charIndex]).setOrigin(0.5, 1).setScale(0.75);

        let button = new Button(this.currentPlayerImage, {
            clickInterval: 100,
            mode: 1
        })
            .on('click', function (button: any, gameObject: any, pointer: any, event: any) {
                scene.setPlayerCharacter();
            })

        // let anchor = new Anchor(this.currentPlayerImage, {
        //     left: '5%+0',
        //     bottom: 'bottom-80',
        // }).anchor();
    }

    addReadyButton(client: any) {
        let scene: any = this;
        const anchorPlayer = this.currentPlayerImage.getBounds();
        this.isReadyImage = this.add.image(0, 25, client.isReady ? 'ready' : 'notready').setAlpha(0.8).setOrigin(0.5, 0.5).setScale(0.4);
        let isReadyButton = new Button(this.isReadyImage, {
            clickInterval: 100,
            mode: 1
        }).on('click', function (button: any, gameObject: any, pointer: any, event: any) {
            scene.setPlayerReady()
        })


        // let anchor = new Anchor(this.isReadyImage, {
        //     left: '15%',
        //     bottom: 'bottom-50',
        // }).anchor();
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

        let characterContainer = this.add.container(0, 0);

        let counter = 0
        for (const sessionId in this.clients) {
            if (Object.prototype.hasOwnProperty.call(this.clients, sessionId)) {
                const client = this.clients[sessionId];

                if (this.room.sessionId === sessionId) {
                    continue;
                }

                const clientPosition = clientPositions[counter];
                const lobbyClient = new LobbyClient(this, client, clientPosition, 0)

                this.lobbyClientList.push(lobbyClient);
                characterContainer.add(lobbyClient);
                counter++;
            }
        }

        let anchor = new Anchor(characterContainer, {
            left: '75%',
            centerY: 'bottom-100'
        }).anchor();
    }

    calculateClientPositions() {
        const clientWidth = 32;
        const screenWidth = this.cameras.main.getBounds().width;
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