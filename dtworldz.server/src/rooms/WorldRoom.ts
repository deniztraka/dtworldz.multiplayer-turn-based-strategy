import { Room, Client } from "colyseus";
import { WorldState, Player, Tile } from "./WorldState";
import { MathUtils } from "../utils/mathUtils";
import { ClientEvents, BaseCommandPayload } from "dtworldz.shared-lib"
import { CommandFactory } from "../factories/commandFactory";
import { Pathfinder } from "../engines/pathfinder";

export class WorldRoom extends Room<WorldState> {
  fixedTimeStep = 1000 / 60;
  pathfinder: Pathfinder;

  onCreate (options: any) {
    this.setState(new WorldState());
    // set map dimensions
    this.state.mapWidth = 10;
    this.state.mapHeight = 10;
    this.buildWorld();
    this.attachGameEvents();

    // defining fixed update loop in here
    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedUpdate(this.fixedTimeStep);
      }
    });
  }

  fixedUpdate(timeStep: number) {
    this.state.players.forEach(player => {
      let commandPayload: any;

      // dequeue player commandPayloads and create commands to execute
      while (commandPayload = player.commandPayloadQueue.shift()) {
        var commandFactory = new CommandFactory()
        var playerCommand = commandFactory.get(commandPayload);
        playerCommand.execute(this, player);
      }
    });
  }

  onJoin (client: Client, _options: any) {
    console.log(client.sessionId, "joined!");

    const player = new Player(client);
    player.mapPos.x = MathUtils.getRandomInt(this.state.mapWidth)
    player.mapPos.y = MathUtils.getRandomInt(this.state.mapHeight)

    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  attachGameEvents(){
    this.onMessage(ClientEvents.Input, (client, commandPayload) => {
      this.handleInput(client, commandPayload)
    });
  }

  handleInput(client: Client, inputCommand: BaseCommandPayload){
      // handle player input
      const player = this.state.players.get(client.sessionId);

      // enqueue command to player command buffer.
      player.commandPayloadQueue.push(inputCommand);
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

  this.pathfinder = new Pathfinder(data);

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
