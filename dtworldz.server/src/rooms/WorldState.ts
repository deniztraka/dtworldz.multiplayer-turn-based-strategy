import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";

// export interface ICommand {
//   commandId: number;
//   tick: number;
// }

export class Player extends Schema {
  @type("number") worldX: number;
  @type("number") worldY: number;
  @type("number") tileX: number;
  @type("number") tileY: number;
  @type("number") tick: number;

  commandPayloadQueue: any[] = [];
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

  @type({ map: Player }) players = new MapSchema<Player>();
}
