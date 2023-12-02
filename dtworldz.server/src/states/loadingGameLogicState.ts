import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";
import { RunningGameLogicState } from "./runningGameLogicState";
import { WorldMapGenerator } from "../engines/proceduralGeneration/worldMapGenerator";
import { TileFactory } from "../models/tilemap/tiles/tileFactory";
import { Natures } from "../models/tilemap/tiles/Natures";
import { ForestMovementStrategy } from "../models/tilemap/strategies/movement/forestMovement";
import { Position } from "../schema/position";
import { MountainsMovement } from "../models/tilemap/strategies/movement/mountainsMovement";
import { BaseTile } from "../schema/tilemap/tile/baseTile";
import { Player } from "../schema/mobiles/player";
import { Attributes } from "../engines/attributeSystem/attributes";
import { StandardMovement } from "../models/tilemap/strategies/movement/standartMovement";
import { CharacterDecorator } from "../decorator/playerDecorator";

// Define the type for a loading step
type LoadingStep = {
    message: string;
    action: (loadingLogicState: LoadingGameLogicState) => Promise<void>;
};

// Define your loading steps with messages and corresponding actions
const loadingSteps: LoadingStep[] = [
    { message: "Loading worldmap...", action: loadMap },
    { message: "Spreading biomes..", action: generateBiomes },
    { message: "Raising forests and mountains", action: generateNature },
    { message: "Finding home for players..", action: findStartingPositions },
    { message: "Prevengint characters going weird places...", action: addMovementBehaviours },
    { message: "Making players special..", action: addCharacterBehaviours },
    // ... other steps
];

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
    generator: WorldMapGenerator;

    constructor(gameRoom: WorldRoom) {
        super(gameRoom);
        this.messageIndex = 0;
    }
    exit(): void {
        console.log("LoadingGameLogicState: Game is finished loading.");
        this.gameRoom.broadcast('loadingGame', { message: 'all is set..', progress: 100 });
        this.messageIndex = 0;
    }

    enter() {
        console.log("LoadingGameLogicState: Game preparing for loading..");
        this.gameRoom.broadcast('loadGame');
        this.elapsedTime = 0;

        setTimeout(() => {
            console.log("LoadingGameLogicState: Loading starts..");
            this.processNextLoadingStep();
        }, 1000);
    }

    update(deltaTime: number): void {

    }

    processNextLoadingStep() {
        if (this.messageIndex < loadingSteps.length) {
            const currentStep = loadingSteps[this.messageIndex];
            const progressPercentage = this.calculateProgressPercentage();

            console.log("LoadingGameLogicState: " + currentStep.message + " (" + progressPercentage + "%)");
            this.broadcastLoadingMessage(currentStep.message, progressPercentage);
            currentStep.action(this).then(() => {
                this.messageIndex++;
                this.processNextLoadingStep();
            })
                .catch((error: any) => {
                    console.error("LoadingGameLogicState: Error during loading:", error.message);
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

async function loadMap(gameLogicState: LoadingGameLogicState): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // create a mew map generator
            // TODO: add seed
            gameLogicState.generator = new WorldMapGenerator(gameLogicState.gameRoom.state.width, gameLogicState.gameRoom.state.height);

            // to be able to send the data to the client in time
            resolve();
        } catch (error) {
            // If there's an error during the load, call reject()
            reject(new Error("LoadingGameLogicState: Failed to load the map"));
        }
    });
}

async function generateBiomes(gameLogicState: LoadingGameLogicState): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            // get rid of reference to the old map
            const biomesData = gameLogicState.generator.generateBiomes();

            for (let y = 0; y < gameLogicState.gameRoom.state.height; y++) {
                for (let x = 0; x < gameLogicState.gameRoom.state.width; x++) {
                    // Push the tile created at (x, y) into the tilemap array
                    gameLogicState.gameRoom.state.tilemap.push(TileFactory.createTile(new Position(x, y), biomesData[y][x]));
                }
            }

            resolve();
        } catch (error: any) {
            // If there's an error during the load, call reject()
            console.log(error.message);
            reject(new Error("LoadingGameLogicState: Failed to generate biomes"));
        }
    });
}

async function generateNature(gameLogicState: LoadingGameLogicState): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            const natureData = gameLogicState.generator.generateNature();

            for (let y = 0; y < gameLogicState.gameRoom.state.height; y++) {
                for (let x = 0; x < gameLogicState.gameRoom.state.width; x++) {
                    const tile = gameLogicState.gameRoom.state.getTile(x, y);

                    // Make sure the natureData is indexed in [y][x] order as well
                    const data = natureData[y][x];
                    if (data > 0.75) {
                        tile.setNature(Natures.Mountain);
                    } else if (data > 0.6) {
                        tile.setNature(Natures.Forest);
                    }
                    // Include an 'else' if you need to handle other nature types or a default case
                }
            }

            resolve();
        } catch (error: any) {
            console.log(error.message);
            // If there's an error during the load, call reject()
            reject(new Error("LoadingGameLogicState: Failed to generate nature"));
        }
    });
}

async function addMovementBehaviours(loadingLogicState: LoadingGameLogicState): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            for (let x = 0; x < loadingLogicState.gameRoom.state.width; x++) {
                for (let y = 0; y < loadingLogicState.gameRoom.state.height; y++) {
                    const tile = loadingLogicState.gameRoom.state.getTile(x, y);
                    if (tile.nature === Natures.None) {
                        tile.setMovementStrategy(new StandardMovement());
                    } else if (tile.nature === Natures.Forest) {
                        tile.setMovementStrategy(new ForestMovementStrategy());
                    } else if (tile.nature === Natures.Mountain) {
                        tile.setMovementStrategy(new MountainsMovement());
                    }

                }
            }

            resolve();
        } catch (error: any) {
            console.log(error.message);
            // If there's an error during the load, call reject()
            reject(new Error("LoadingGameLogicState: Failed to generate nature"));
        }
    });
}

function findStartingPositions(loadingLogicState: LoadingGameLogicState): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {

            let cleanTiles: BaseTile[] = [];
            // find a randome 'Plains' tile for each player
            loadingLogicState.gameRoom.state.tilemap.forEach(tile => {
                if (tile.nature === Natures.None) {
                    cleanTiles.push(tile);
                    // console.log(`${tile.position.x} ${tile.position.y} ${tile.nature}`);
                }
            });


            loadingLogicState.gameRoom.getPlayers().forEach(player => {
                const randomTile = cleanTiles[Math.floor(Math.random() * cleanTiles.length)];
                player.position = randomTile.position;

                //delete the tile from the list so that we don't use it again
                const index = cleanTiles.indexOf(randomTile);
                if (index > -1) {
                    cleanTiles.splice(index, 1);
                }
            });


            resolve();
        } catch (error: any) {
            console.log(error.message);
            // If there's an error during the load, call reject()
            reject(new Error("LoadingGameLogicState: Failed to find starting position for players"));
        }
    });
}

function addCharacterBehaviours(loadingLogicState: LoadingGameLogicState): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            loadingLogicState.gameRoom.getPlayers().forEach(player => {
                CharacterDecorator.decorate(player);
                console.log(player.hungerDecay);
            });



            resolve();
        } catch (error: any) {
            console.log(error.message);
            // If there's an error during the load, call reject()
            reject(new Error("LoadingGameLogicState: Failed to set character behaviorus"));
        }
    });
}



