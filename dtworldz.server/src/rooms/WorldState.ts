import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Client } from "colyseus";
import { BaseCommandPayload } from "dtworldz.shared-lib"
import Color = require("color");

export class MapPos extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  constructor(x: number = 0, y: number = 0) {
    super();
    this.x = x;
    this.y = y;
  }
}

export class Player extends Schema {
  @type(MapPos) mapPos: MapPos;
  @type("number") tick: number;
  @type("number") test: number;
  @type("number") color: number;
  @type("string") name: string;

  commandPayloadQueue: BaseCommandPayload[] = [];
  client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
    this.mapPos = new MapPos();
    this.test = 0;
    this.color = Color.rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255).rgbNumber();
  }
}

export class Tile extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") index: number;
}

export class WorldState extends Schema {
  @type("number") mapWidth: number;
  @type("number") mapHeight: number;
  @type([ Tile ]) mapData = new ArraySchema<Tile>();
  @type("string") currentPlayerSessionId: string;
  @type({ map: Player }) players = new MapSchema<Player>();
}
