"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TileSelectedCommand = void 0;
class TileSelectedCommand {
    constructor(commandPayload) {
        this.tick = commandPayload.tick;
        this.payload = commandPayload.payload;
    }
    execute() {
        console.log(this.payload);
        console.log("Tle selected job is executed");
    }
}
exports.TileSelectedCommand = TileSelectedCommand;
