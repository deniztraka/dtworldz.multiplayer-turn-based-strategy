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
    
        // Update ongoing actions using a reverse for-loop
        for (let i = this.ongoingActions.length - 1; i >= 0; i--) {
            const action = this.ongoingActions[i];
    
            if (currentTime >= action.startTime + action.elapsedTime) {
                //console.log(`Action details: startTime=${action.startTime}, elapsedTime=${action.elapsedTime}, duration=${action.duration}`);

    
                action.update(this.worldRoom, deltaTime);
                action.elapsedTime += deltaTime;
    
                // Remove action if completed
                if (action.elapsedTime >= action.duration) {
                    this.ongoingActions.splice(i, 1);
                }
            }
        }
    
        // Execute atomic actions
        while (this.atomicActions.length > 0) {
            const action = this.atomicActions.shift();
            action.execute(this.worldRoom);
        }
    }
    

    // Methods to add actions, etc.
}