"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandFactory = void 0;
const dtworldz_shared_lib_1 = require("dtworldz.shared-lib");
const tileSelectedCommand_1 = require("../commands/tileSelectedCommand");
class CommandFactory {
    constructor() {
    }
    get(commandPayload) {
        switch (commandPayload.id) {
            case dtworldz_shared_lib_1.Commands.TileSelected:
                return new tileSelectedCommand_1.TileSelectedCommand(commandPayload);
        }
    }
}
exports.CommandFactory = CommandFactory;
