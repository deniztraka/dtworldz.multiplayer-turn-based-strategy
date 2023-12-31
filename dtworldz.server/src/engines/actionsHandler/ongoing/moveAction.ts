import { WorldRoom } from "../../../rooms/dtWorldz";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { TilePosCost } from "../../../schema/tilemap/tile/tilePosCost";
import { MathUtils } from "../../../utils/mathUtils";
import { OngoingAction } from "./OngoingAction";
import { ArraySchema } from "@colyseus/schema";

export class MoveAction extends OngoingAction {
    private elapsedTimeSinceLastMove: number = 900; // Counter for time since last move
    moveInterval: number;

    constructor(mobile: BaseMobile, payload: any) {
        super(mobile, payload, 0);
        this.duration = this.getCalculatedDuration();
        this.moveInterval = 1000 / (this.mobile as Player).speed; // 1000 ms divided by speed
        this.elapsedTimeSinceLastMove = this.moveInterval;
    }

    update(worldRoom: WorldRoom, deltaTime: number): void {
        
        this.mobile.setMovingNow(true);
        // Update the elapsed time
        this.elapsedTimeSinceLastMove += deltaTime;

        // Calculate the movement interval based on the player's speed


        // Check if it's time to move
        if (this.elapsedTimeSinceLastMove >= this.moveInterval) {
            if (this.mobile.currentPath.length > 0) {
                // Check if the next step is the player's current position
                if (this.mobile.currentPath[0].position.x === this.mobile.position.x && this.mobile.currentPath[0].position.y === this.mobile.position.y) {
                    this.mobile.currentPath.shift(); // Remove the first point if it's the current position
                }

                // If there are still steps left in the path, move to the next one
                if (this.mobile.currentPath.length > 0) {
                    const nextStep = this.mobile.currentPath.shift();
                    const nextTile = worldRoom.state.getTile(nextStep.position.x, nextStep.position.y);

                    let moveResult = this.mobile.tryMove(nextTile);

                    // Send the move result to the client
                    (this.mobile as Player).client.send('ca_action_result',
                        {
                            aid: 'move',
                            sessionId: (this.mobile as Player).client.sessionId,
                            payload: {
                                result: moveResult,
                                message: moveResult ? '' : "Can't move further",
                                targetPosition: { x: nextTile.position.x, y: nextTile.position.y }
                            }
                        });

                    if(!moveResult){
                        // Stop the movement
                        this.mobile.currentPath = new ArraySchema<TilePosCost>;
                        this.elapsedTime = this.duration;
                    }

                    //console.log(`moveResult: ${moveResult} ${this.mobile.name} ${nextTile.position.x} ${nextTile.position.y}`);

                    // Reset the counter after the move
                    this.elapsedTimeSinceLastMove -= this.moveInterval;
                }
            }
        }
    }

    onCompleted(worldRoom: WorldRoom) {
        this.mobile.setMovingNow(false);
    }

    getCalculatedDuration(): number {
        return MathUtils.getDistanceBetweenPoints(this.mobile.position.x, this.mobile.position.y, this.payload.x, this.payload.y) / (this.mobile as Player).speed * 1000;
    }
}