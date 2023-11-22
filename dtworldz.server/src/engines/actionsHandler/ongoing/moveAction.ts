import { WorldRoom } from "../../../rooms/dtWorldz";
import { Player } from "../../../schema/mobiles/player";
import { MathUtils } from "../../../utils/mathUtils";
import { OngoingAction } from "./OngoingAction";

export class MoveAction extends OngoingAction {
    constructor(player: Player, actionPayload: any) {
        super(player, actionPayload, 0);
        this.duration = this.getCalculatedDuration();
    }

    update(roomState: WorldRoom, deltaTime: number): void {
        if (this.player.currentPath.length > 0) {
            const nextStep = this.player.currentPath.shift();
            let moveResult = this.player.tryMove(nextStep);

            console.log(`moveResult: ${moveResult} ${this.player.name} ${nextStep.position.x} ${nextStep.position.y}`);
        }
    }

    getCalculatedDuration(): number {
        return MathUtils.getDistanceBetweenPoints(this.player.position.x, this.player.position.y, this.actionPayload.x, this.actionPayload.y) / this.player.speed;
    }
}