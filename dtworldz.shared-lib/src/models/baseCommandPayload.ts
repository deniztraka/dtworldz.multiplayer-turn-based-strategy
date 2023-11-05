abstract class BaseCommandPayload {
    id: number
    tick: number
    payload: any
    constructor(id: number, tick: number, payload: any) {
        this.id = id;
        this.tick = tick;
        this.payload = payload;
    }
}

export { BaseCommandPayload }