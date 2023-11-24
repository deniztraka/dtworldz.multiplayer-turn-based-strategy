import { WorldRoom } from "../../../rooms/dtWorldz";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { MathUtils } from "../../../utils/mathUtils";
import { OngoingAction } from "./OngoingAction";

export class MoveAction extends OngoingAction {
    private elapsedTimeSinceLastMove: number = 0; // Counter for time since last move

    constructor(mobile: BaseMobile, payload: any) {
        super(mobile, payload, 0);
        this.duration = this.getCalculatedDuration();
    }

    update(worldRoom: WorldRoom, deltaTime: number): void {
        // Update the elapsed time
        this.elapsedTimeSinceLastMove += deltaTime;
    
        // Calculate the movement interval based on the player's speed
        const moveInterval = 1000 / this.mobile.speed; // 1000 ms divided by speed
    
        // Check if it's time to move
        if (this.elapsedTimeSinceLastMove >= moveInterval) {
            if (this.mobile.currentPath.length > 0) {
                // Check if the next step is the player's current position
                if (this.mobile.currentPath[0].x === this.mobile.position.x && this.mobile.currentPath[0].y === this.mobile.position.y) {
                    this.mobile.currentPath.shift(); // Remove the first point if it's the current position
                }
    
                // If there are still steps left in the path, move to the next one
                if (this.mobile.currentPath.length > 0) {
                    const nextStep = this.mobile.currentPath.shift();
                    const nextTile = worldRoom.state.getTile(nextStep.x, nextStep.y);
    
                    let moveResult = this.mobile.tryMove(nextTile);
                    //console.log(`moveResult: ${moveResult} ${this.mobile.name} ${nextTile.position.x} ${nextTile.position.y}`);
    
                    // Reset the counter after the move
                    this.elapsedTimeSinceLastMove -= moveInterval;
                }
            }
        }
    }

    getCalculatedDuration(): number {
        return MathUtils.getDistanceBetweenPoints(this.mobile.position.x, this.mobile.position.y, this.payload.x, this.payload.y) / this.mobile.speed * 1000;
    }
}