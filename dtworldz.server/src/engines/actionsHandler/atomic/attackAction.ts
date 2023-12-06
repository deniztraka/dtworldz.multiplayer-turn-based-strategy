import { WorldRoom } from "../../../rooms/dtWorldz";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { AtomicAction } from "./atomicAction";

export class AttackAction extends AtomicAction {
    constructor(mobile: BaseMobile, payload: { toMobileSessionId: string }) {
        super(mobile, payload);
    }

    execute(worldRoom: WorldRoom): void {
        if (this.mobile instanceof Player) {
            const targetPlayer = worldRoom.state.players.get(this.payload.toMobileSessionId);
            if (targetPlayer) {
                const damageTaken = this.mobile.attack(targetPlayer);
                // Send attack result to the client
                worldRoom.broadcast('ca_action_result',
                {
                    aid: 'attack',
                    sessionId: this.mobile.client.sessionId,
                    payload: {
                        result: true,
                        targetSessionId: targetPlayer.client.sessionId,
                        message: `${this.mobile.name} attacked ${targetPlayer.name}`,
                        damage: damageTaken
                    }
                });
            }
        }
    }
}