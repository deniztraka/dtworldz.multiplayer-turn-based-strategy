import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";
import { RunningGameLogicState } from "./runningGameLogicState";


const interval = 1500; // 1 second

const loadingMessages = [
    "Loading worldmap...",
    "Adding grass...",
    "Growing trees...",
    "Pouring water...",
    "Adding some salt...",
    "Rising mountains...",
    "Diggging caves...",
    "Converting caves to dungeons...",
    "Adding some monsters...",
    "Adding some NPCs...",
    "Scattering around some gold...",
    "Items are being dropped...",
    "Loading quests...",
    "Building castles and towers...",
    "Creating some villages...",
    "Adding some roads...",
    "Loading merchants...",
    "Making players hungry...",
    "Making players thirsty...",
    "We think we are done...",
    "The world awaits your arrival...",
    "Are you ready?"
];

// Concrete states
export class LoadingGameLogicState extends BaseGameLogicState {
    messageIndex: number;

    constructor(gameRoom: WorldRoom) {
        super(gameRoom);
        this.messageIndex = 0;
    }
    exit(): void {
        console.log("GameLogicState: Game is finished loading.");
    }

    enter() {
        console.log("GameLogicState: Game is loading.");
        this.gameRoom.broadcast('loadGame');
        this.elapsedTime = 0;
        this.messageIndex = 0;
    }

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;

        // send loading message for every interval seconds
        if (this.elapsedTime % interval < deltaTime) {
            console.log(this.elapsedTime)
            if (this.messageIndex < loadingMessages.length) {
                console.log("asdfsf")
                this.broadcastLoadingMessage();
                this.messageIndex++;
            }
            else {
                console.log("aaa")
                this.gameRoom.changeState(new RunningGameLogicState(this.gameRoom));
            }
        }
    }

    broadcastLoadingMessage() {
        // delete first message from the loadingMessages array
        const message = loadingMessages[this.messageIndex];
        this.gameRoom.broadcast('loadingGame', message);
        console.log(message + this.elapsedTime);
    }
}