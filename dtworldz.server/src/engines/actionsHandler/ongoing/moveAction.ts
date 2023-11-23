import { WorldRoom } from "../../../rooms/dtWorldz";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { MathUtils } from "../../../utils/mathUtils";
import { OngoingAction } from "./OngoingAction";

export class MoveAction extends OngoingAction {
    constructor(mobile: BaseMobile, payload: any) {
        super(mobile, payload, 0);
        this.duration = this.getCalculatedDuration();
    }

    update(roomState: WorldRoom, deltaTime: number): void {
        if (this.mobile.currentPath.length > 0) {
            const nextStep = this.mobile.currentPath.shift();
            let moveResult = this.mobile.tryMove(nextStep);

            console.log(`moveResult: ${moveResult} ${this.mobile.name} ${nextStep.position.x} ${nextStep.position.y}`);
        }
    }

    getCalculatedDuration(): number {
        return MathUtils.getDistanceBetweenPoints(this.mobile.position.x, this.mobile.position.y, this.payload.x, this.payload.y) / this.mobile.speed;
    }
}