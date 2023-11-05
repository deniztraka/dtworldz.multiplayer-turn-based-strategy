"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldState = exports.Tile = exports.Player = void 0;
const schema_1 = require("@colyseus/schema");
// export interface ICommand {
//   commandId: number;
//   tick: number;
// }
class Player extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.commandPayloadQueue = [];
    }
}
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "worldX", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "worldY", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "tileX", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "tileY", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "tick", void 0);
exports.Player = Player;
class Tile extends schema_1.Schema {
}
__decorate([
    (0, schema_1.type)("number")
], Tile.prototype, "x", void 0);
__decorate([
    (0, schema_1.type)("number")
], Tile.prototype, "y", void 0);
__decorate([
    (0, schema_1.type)("number")
], Tile.prototype, "index", void 0);
exports.Tile = Tile;
class WorldState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.mapData = new schema_1.ArraySchema();
        this.players = new schema_1.MapSchema();
    }
}
__decorate([
    (0, schema_1.type)("number")
], WorldState.prototype, "mapWidth", void 0);
__decorate([
    (0, schema_1.type)("number")
], WorldState.prototype, "mapHeight", void 0);
__decorate([
    (0, schema_1.type)([Tile])
], WorldState.prototype, "mapData", void 0);
__decorate([
    (0, schema_1.type)({ map: Player })
], WorldState.prototype, "players", void 0);
exports.WorldState = WorldState;
