import { Room, Client } from "colyseus";
import { WorldState, Player, Tile } from "./WorldState";
import { MathUtils } from "../utils/mathUtils";
import { ClientEvents } from "dtworldz.shared-lib"
import { CommandFactory } from "../factories/commandFactory";

export class WorldRoom extends Room<WorldState> {
  fixedTimeStep = 1000 / 60;

  onCreate (options: any) {
    this.setState(new WorldState());
    // set map dimensions
    this.state.mapWidth = 10;
    this.state.mapHeight = 10;
    this.buildWorld();

    this.onMessage(ClientEvents.Input, (client, command) => {
      // handle player input
      const player = this.state.players.get(client.sessionId);

      console.log(command);

      // enqueue command to player command buffer.
      player.commandPayloadQueue.push(command);
    });

    // this.onMessage(ClientEvents.TileSelected, (client, tile: { x: number; y: number; }) => {
    //   // handle player input
    //   const player = this.state.players.get(client.sessionId);

    //   console.log(tile);
    // });

    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedTick(this.fixedTimeStep);
      }
    });
  }


  fixedTick(timeStep: number) {
    // const velocity = 2;

    this.state.players.forEach(player => {
      let commandPayload: any;

      // dequeue player commandPayloads and create commands to execute
      while (commandPayload = player.commandPayloadQueue.shift()) {
        var commandFactory = new CommandFactory()
        var playerCommand = commandFactory.get(commandPayload);

        //player.tick = commandPayload.tick;
        playerCommand.execute();
      }
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const player = new Player();
    player.tileX = MathUtils.getRandomInt(this.state.mapWidth)
    player.tileY = MathUtils.getRandomInt(this.state.mapHeight)

    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  // TODO: extract to another place
  buildWorld() {
    var data = [
      [ 10, 11, 12, 13, 14, 15, 16, 10, 11, 12 ],
      [ 13, 11, 10, 12, 12, 104, 16, 10, 16, 10 ],
      [ 12, 10, 16, 13, 14, 104, 16, 16, 13, 12 ],
      [ 10, 11, 12, 104, 104, 104, 16, 10, 11, 12 ],
      [ 13, 11, 10, 104, 12, 15, 16, 10, 16, 10 ],
      [ 12, 10, 16, 104, 14, 15, 16, 16, 13, 12 ],
      [ 10, 11, 12, 13, 104, 15, 16, 10, 11, 12 ],
      [ 13, 11, 10, 12, 12, 104, 16, 10, 16, 10 ],
      [ 12, 10, 16, 13, 14, 104, 16, 16, 13, 12 ],
      [ 10, 11, 12, 13, 14, 15, 16, 10, 11, 12 ]
  ];

    for (let x = 0; x < this.state.mapWidth; x++) {
      for (let y = 0; y < this.state.mapHeight; y++) {
        var tile = new Tile()
        tile.x = x;
        tile.y = y;
        tile.index = data[x][y];
        this.state.mapData.push(tile);
      }
    }
  }
}
