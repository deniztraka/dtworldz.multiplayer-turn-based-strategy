import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Client } from "colyseus";
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

export class Tile extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") index: number;
}

