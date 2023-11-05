export class TileSelectedCommand implements ICommand{
    tick: number;
    payload: {x: number, y: number}
    constructor(commandPayload:{id:number, tick: number, payload: {x: number, y: number}}) {
        this.tick = commandPayload.tick
        this.payload = commandPayload.payload
    }
    execute(): void {
        console.log(this.payload);
        console.log("Tle selected job is executed");
    }
   
}