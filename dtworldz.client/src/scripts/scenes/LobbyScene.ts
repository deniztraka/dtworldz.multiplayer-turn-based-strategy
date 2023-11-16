import Phaser from "phaser";
import { Room } from "colyseus.js";

export class LobbyScene extends Phaser.Scene {
    room: Room | undefined;
    clients: { [sessionId: string]: any } = {};

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    playerName: string;
    currentClient: any;
    currentSessionId: any;
    isReady: boolean = false;
    chatBox: Phaser.GameObjects.Text | undefined;

    constructor() {
        super({ key: "LobbyScene" });

    }

    init(data: { room: Room, playerName: string }) {
        this.playerName = data.playerName;
        this.room = data.room;
    }

    preload() {

    }

    create() {
        this.attachRoomEvents();
        this.createUI();
        this.createChatUI();
    }

    attachRoomEvents() {
        this.room.state.players.onAdd((client: any, sessionId: any) => {
            this.currentClient = client;
            this.currentSessionId = sessionId;
            this.clients[sessionId] = client;

            this.attachClientEvents(this.currentClient, this.currentSessionId);

        });

        this.room.onMessage('chat', (message) => {
            console.log('Received chat message: ', message.text)
            this.updateChatBox(`${message.sender}: ${message.text}`);
        });

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((_player: any, sessionId: any) => {
            console.log(`${sessionId} is removed`);
            const client = this.clients[sessionId]

            if (client) {
                delete this.clients[sessionId]
                this.createUI();
            }
        });
    }

    attachClientEvents(client: any, sessionId: any) {
        client.listen('isReady', (isReady: any) => {
            this.isReady = isReady;
            this.createUI();
        });
    }

    displayPlayerList() {
        let startY = 200; // Starting Y position for the first player
        const spacingY = 30; // Vertical spacing between players

        this.add.text(100, startY - 50, 'Players: ').setStyle({ color: "#ffffff" });
        this.add.text(225, startY - 50, 'Ready ? ').setStyle({ color: "#ffffff" });

        for (let sessionId in this.clients) {
            if (this.clients.hasOwnProperty(sessionId)) {
                const client = this.clients[sessionId];
                const index = Object.keys(this.clients).indexOf(sessionId);

                // Display the player's name
                this.add.text(100, startY + (index * spacingY), client.name).setStyle({ color: "#ffffff" });

                // Display a colored square based on the player's ready status
                const color = client.isReady ? '#0f0' : '#f00'; // Green if ready, red if not
                const size = 20; // Size of the square
                this.add.rectangle(250, startY + (index * spacingY) + size / 2, size, size, Phaser.Display.Color.HexStringToColor(color).color);
            }
        }
    }

    createReadyButton() {
        let readyButton = this.add.text(100, 400, 'Ready').setStyle({ fill: '#0f0', backgroundColor: '#000' })
            .setInteractive()
            .on('pointerdown', () => this.setPlayerReady());
    }

    setPlayerReady() {
        this.isReady = !this.isReady;
        this.room.send('isReady', { isReady: this.isReady });
    }

    createUI() {
        this.children.removeAll();
        this.add.text(100, 50, 'Lobby: ' + this.room.id).setStyle({ color: "#ffffff" });
        this.displayPlayerList();
        this.createReadyButton();
        this.createChatUI();
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
