import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { BaseTile } from "./tilemap/tile/baseTile";
import { Player } from "./mobiles/player";
import { BaseGameLogicState } from "../states/baseGameLogicState";
import { LobbyGameLogicState } from "../states/lobbyGameLogicState";

export class DTWorldzState extends Schema {
  @type("number") width: number;
  @type("number") height: number;
  @type([BaseTile]) tilemap = new ArraySchema<BaseTile>();
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(BaseGameLogicState) currentGameLogicState: BaseGameLogicState;
  constructor(width: number = 0, height: number = 0) {
    super();
    this.width = width;
    this.height = height;
  }
}
