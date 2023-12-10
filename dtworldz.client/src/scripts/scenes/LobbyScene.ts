import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import Button from 'phaser3-rex-plugins/plugins/button.js';
import { LobbyClient } from "../models/lobbyClient";
import { LobbyChatPanel } from "../utils/ui/lobbyChatPanel";
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';
import { DTButton } from "../utils/ui/dtButton";
import { LobbyCharacterDetailsPanel } from "../ui/lobby/lobbyCharacterDetailsPanel";
import { LobbyReadyButton } from "../ui/lobby/lobbyReadyButton";
import { LobbyChatButton } from "../ui/lobby/lobbyChatButton";


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
    currentPlayerTitle: any;
    startText: any;
    heroTitles: any;
    characters: any;
    localCharacterDetailsPanel: LobbyCharacterDetailsPanel;
    chatButton: LobbyChatButton;

    constructor() {
        super({ key: "LobbyScene" })
        this.localClient = {};
    }

    async init(data: { room: Room, playerName: string, characters: any }) {
        this.characters = data.characters;
        this.room = data.room;
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

                this.addCharacterDetailsPanel(this.localClient);

                this.addPlayerName(client);
                this.addChangeCharacterButton(client);
                this.addReadyButton(client);
                this.createStartButton()
                this.createChatButton();

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
        });



        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((_client: any, sessionId: any) => {
            this.events.emit('onClientRemove', _client, sessionId);
        });
        this.events.on('onClientRemove', (_client: any, sessionId: any) => {
            const client = this.clients[sessionId]

            if (client) {
                delete this.clients[sessionId]
                this.refreshPlayerList();
            }
        });


    }
    addCharacterDetailsPanel(localClient: any) {
        this.localCharacterDetailsPanel = new LobbyCharacterDetailsPanel(this, this.characters[localClient.charIndex]);
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

    

    createRoomIdButton() {
        let scene: any = this;
        this.roomIdText = new DTLabel(this, 0, 0, this.room.id, {}, {
            centerX: 'center',
            bottom: 'bottom-10',
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
        new Anchor(this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5).setAlpha(0.75), { centerY: 'center', centerX: 'center' })
        new Anchor(this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo')
            .setOrigin(0.5, 0.5).setScale(1.5).setTint(0xbdced6), { top: '5%', centerX: 'center' })
    }

    addPlayerName(client: any) {
        new DTLabel(this, 0, 0, client.name, {}, {
            centerX: 'center-200',
            bottom: 'bottom-110',
        });
    }

    setCharacterPanel() {
        this.sound.play('button');
        this.localClient.charIndex = (this.localClient.charIndex + 1) % Object.keys(this.characters).length;
        this.localCharacterDetailsPanel.setCharacter(this.characters[this.localClient.charIndex]);
        this.room.send('charIndex', { charIndex: this.localClient.charIndex });
        this.refreshPlayerList();
    }

    createChatButton() {
        this.chatButton = new LobbyChatButton(this, 0, 0, 'Open Chat', this.onChatButtonClicked.bind(this),
            { centerX: 'center+210', bottom: 'bottom-440' }).setScale(1);
    }

    onChatButtonClicked() {
        this.sound.play('button');
        this.chatPanel.toggle();
    }

    createStartButton() {
        if (!this.clients[this.room.sessionId].isOwner) {
            return;
        }
        this.startGame = false;
        this.startButton = new DTButton(this, 0, 0, 'Start', this.onStartClicked.bind(this),
            { centerX: 'center+230', bottom: 'bottom-50' }).setEnabled(false).setScale(1.25);
    }

    addChangeCharacterButton(client: any) {
        let scene: any = this;

        let changeCharacterButton = new DTButton(this, 0, 0, 'Change Hero', this.setCharacterPanel.bind(this), { centerX: 'center-180', bottom: 'bottom-50' }).setScale(1.25)
    }

    addReadyButton(client: any) {
        let scene: any = this;

        let readyButton = new LobbyReadyButton(this, 0, 0, 'Not Ready', scene.setPlayerReady.bind(this), { centerX: 'center+50', bottom: 'bottom-50' }).setScale(1.25)

    }

    copyRoomIdToClipboard() {
        this.sound.play('button');
        navigator.clipboard.writeText(this.room.id)
            .then(() => {
                console.log('RoomId copied to clipboard');
            })
            .catch((error) => {
                console.error('Failed to copy RoomId to clipboard', error);
            });
    }

    onStartClicked() {
        this.sound.play('button');
        this.startGame = !this.startGame;
        this.room.send('startGame', { startGame: this.startGame });
    }

    refreshPlayerList() {
        const offsetX = 50;
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
                const lobbyClient = new LobbyClient(this, client, clientPosition + offsetX, 0)

                this.lobbyClientList.push(lobbyClient);
                characterContainer.add(lobbyClient);
                counter++;
            }
        }

        let anchor = new Anchor(characterContainer, {
            centerX: 'center',
            centerY: 'center',
        }).anchor();
    }

    calculateClientPositions() {
        const clientWidth = 100;
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
        this.sound.play('button');
        this.localClient.isReady = !this.localClient.isReady;
        // this.isReadyImage.setTexture(this.localClient.isReady ? 'ready' : 'notready');
        this.room.send('isReady', { isReady: this.localClient.isReady });
        this.refreshPlayerList();
    }

    setPlayerCharacter() {
       
    }
}