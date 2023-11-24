import { Schema, type } from "@colyseus/schema";

export class Position extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    constructor(x: number = 0, y: number = 0) {
      super();
      this.x = x;
      this.y = y;
    }
  }