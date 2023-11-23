"usestrict"

import { WorldRoom } from "../../rooms/dtWorldz";
import { AtomicAction } from "./atomic/atomicAction";
import { BaseGameAction } from "./baseGameAction";
import { OngoingAction } from "./ongoing/OngoingAction";

export class ActionManager {
    ongoingActions: OngoingAction[] = [];
    atomicActions: AtomicAction[] = [];
    worldRoom: WorldRoom;

    constructor(worldRoom: WorldRoom) {
        this.worldRoom = worldRoom;
    }

    handleNewAction(action: BaseGameAction) {
        if (action instanceof OngoingAction) {
            
            this.ongoingActions.push(action);
        } else if (action instanceof AtomicAction) {
            
            this.atomicActions.push(action);
        }
    }

    updateActions(deltaTime: number) {
        const currentTime = new Date().getTime();

        // Update ongoing actions
        this.ongoingActions.forEach(action => {
            if (currentTime >= action.startTime + action.elapsedTime) {
                action.update(this.worldRoom, deltaTime);
                action.elapsedTime += deltaTime;

                // Remove action if completed
                if (action.elapsedTime >= action.duration) {
                    this.ongoingActions.splice(this.ongoingActions.indexOf(action), 1);
                }
            }
        });

        // Execute atomic actions
        while (this.atomicActions.length > 0) {
            const action = this.atomicActions.shift();
            action.execute(this.worldRoom);
        }
    }

    // Methods to add actions, etc.
}