import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { BaseTile } from "./tilemap/tile/baseTile";
import { Player } from "./mobiles/player";
import { BaseGameLogicState } from "../states/baseGameLogicState";

export class DTWorldzState extends Schema {
  @type("number") width: number;
  @type("number") height: number;
  @type([BaseTile]) tilemap: ArraySchema<BaseTile>;
  @type({ map: Player }) players = new MapSchema<Player>();
  currentGameLogicState: BaseGameLogicState;
  constructor(width: number = 0, height: number = 0) {
    super();
    this.width = width;
    this.height = height;
    this.tilemap = new ArraySchema<BaseTile>();
  }

  getTile(x: number, y: number): BaseTile {
     return this.tilemap[y * this.width + x];
    //return this.tilemap[x * this.height + y];
  }
}
