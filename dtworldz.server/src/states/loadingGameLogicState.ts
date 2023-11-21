import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";
import { RunningGameLogicState } from "./runningGameLogicState";
import { WorldMapGenerator } from "../engines/worldMapGenerator";
import { PlainsTile } from "../models/tilemap/tiles/plainsTile";

// Define the type for a loading step
type LoadingStep = {
    message: string;
    action: (gameRoom: WorldRoom) => Promise<void>;
};

// Define your loading steps with messages and corresponding actions
const loadingSteps: LoadingStep[] = [
    { message: "Loading worldmap...", action: loadMap },
    // ... other steps
];


const interval = 1500; // 1 second

// const loadingMessages = [
//     "Loading worldmap...",
//     "Adding grass...",
//     "Growing trees...",
//     "Pouring water...",
//     "Adding some salt...",
//     "Rising mountains...",
//     "Diggging caves...",
//     "Converting caves to dungeons...",
//     "Adding some monsters...",
//     "Adding some NPCs...",
//     "Scattering around some gold...",
//     "Items are being dropped...",
//     "Loading quests...",
//     "Building castles and towers...",
//     "Creating some villages...",
//     "Adding some roads...",
//     "Loading merchants...",
//     "Making players hungry...",
//     "Making players thirsty...",
//     "We think we are done...",
//     "The world awaits your arrival...",
//     "Are you ready?"
// ];

// Concrete states
export class LoadingGameLogicState extends BaseGameLogicState {
    messageIndex: number;

    constructor(gameRoom: WorldRoom) {
        super(gameRoom);
        this.messageIndex = 0;
    }
    exit(): void {
        console.log("GameLogicState: Game is finished loading.");
        this.gameRoom.broadcast('loadingGame', { message: 'all is set...', progress: 100 });
        this.messageIndex = 0;
    }

    enter() {
        console.log("GameLogicState: Game preparing for loading..");
        this.gameRoom.broadcast('loadGame');
        this.elapsedTime = 0;

        setTimeout(() => {
            console.log("GameLogicState:loading starts..");
            this.processNextLoadingStep();
        }, 1000);
    }

    update(deltaTime: number): void {

    }

    processNextLoadingStep() {
        if (this.messageIndex < loadingSteps.length) {
            const currentStep = loadingSteps[this.messageIndex];
            const progressPercentage = this.calculateProgressPercentage();

            this.broadcastLoadingMessage(currentStep.message, progressPercentage);
            currentStep.action(this.gameRoom).then(() => {
                this.messageIndex++;
                this.processNextLoadingStep();
            })
                .catch((error: any) => {
                    console.error("Error during loading:", error.message);
                });
        } else {
            setTimeout(() => {
                this.gameRoom.changeState(new RunningGameLogicState(this.gameRoom));
            }, 500);
        }
    }

    calculateProgressPercentage(): number {
        return Math.round((this.messageIndex / loadingSteps.length) * 100);
    }

    broadcastLoadingMessage(message: string, progressPercentage: number) {
        const progressMessage = `${message} (${progressPercentage}%)`;
        this.gameRoom.broadcast('loadingGame', { message: message, progress: progressPercentage });
        console.log(progressMessage);
    }
}

async function loadMap(gameRoom: WorldRoom): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            console.log("Loading map...");
            // get rid of reference to the old map
            const generator = new WorldMapGenerator(gameRoom.state.width, gameRoom.state.height);
            const mapData = generator.generate();

            for (let x = 0; x < gameRoom.state.width; x++) {
                for (let y = 0; y < gameRoom.state.height; y++) {
                    let tile = mapData[x][y];
                    gameRoom.state.tilemap.push(tile);
                }
            }

            // to be able to send the data to the client in time
            resolve();
        } catch (error) {
            // If there's an error during the load, call reject()
            reject(new Error("Failed to load the map"));
        }
    });
}