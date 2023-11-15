import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { BaseTile } from "./tilemap/tile/baseTile";
import { Player } from "./mobiles/player";

export class DTWorldzState extends Schema {
  @type("number") width: number;
  @type("number") height: number;
  @type([BaseTile]) tilemap = new ArraySchema<BaseTile>();
  @type({ map: Player }) players = new MapSchema<Player>();
}
