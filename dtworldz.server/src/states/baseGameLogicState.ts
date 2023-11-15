import { Schema } from "@colyseus/schema";
import { WorldRoom } from "../rooms/dtWorldz";

export abstract class BaseGameLogicState extends Schema {
    gameRoom: WorldRoom;
    constructor(gameRoom: WorldRoom) {
        super();
        this.gameRoom = gameRoom;
    }
    abstract enter(): void;
    abstract exit(): void;
    abstract update(deltaTime: number): void
}