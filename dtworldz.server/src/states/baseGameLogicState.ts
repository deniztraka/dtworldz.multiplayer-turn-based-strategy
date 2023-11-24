import { Schema } from "@colyseus/schema";
import { WorldRoom } from "../rooms/dtWorldz";

export abstract class BaseGameLogicState {
    gameRoom: WorldRoom;
    elapsedTime: number;
    constructor(gameRoom: WorldRoom) {
        this.elapsedTime = 0;
        this.gameRoom = gameRoom;
    }
    abstract enter(): void;
    abstract exit(): void;
    abstract update(deltaTime: number): void
}