import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";

// Concrete states
export class RunningGameLogicState extends BaseGameLogicState {
    constructor(gameRoom: WorldRoom) {
        super(gameRoom);
    }
    exit(): void {

    }
    enter() {
        this.gameRoom.broadcast('gameIsRunning', {});
        this.attachGameEvents();
        console.log("GameLogicState: Game Is Started and Running");
        
        
    }

    update(deltaTime: number) {

    }

    attachGameEvents() {
        this.gameRoom.onMessage('ca_action', (client, actionPayload) => {
            // console.log(`received action request from ${client.sessionId}`)

            // get client's player
            let player = this.gameRoom.getPlayer(client.sessionId);

            // create action from payload and handle it (will be put in queue)
            let action = this.gameRoom.getActionFactory().get(player, actionPayload);
            this.gameRoom.getActionManager().handleNewAction(action);
        });
    }
}