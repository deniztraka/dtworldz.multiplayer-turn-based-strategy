import { Room, Client, ServerError } from "colyseus";
import { WorldState, Player, Tile, MapPos } from "./WorldState";
import { MathUtils } from "../utils/mathUtils";
import { ClientEvents, BaseCommandPayload, ServerEvents } from "dtworldz.shared-lib"
import { CommandFactory } from "../factories/commandFactory";
import { Pathfinder } from "../engines/pathfinder";

export class WorldRoom extends Room<WorldState> {
  turnTime = 10000; // 60,000 milliseconds = 1 minute
  turnTimeLeftBroadcastTime = 1000; // 1,000 milliseconds = 1 second
  fixedTimeStep = 1000 / 60;
  pathfinder: Pathfinder;
  turnTimeCounter = 0;
  turnTimeLeftCounter = 0
  currentPlayerIndex: number;
  isStarted: boolean = false;

  onCreate(options: any) {
    this.setState(new WorldState());
    this.currentPlayerIndex = 0;
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

    this.onMessage(ClientEvents.InitPlayerData, (client, commandPayload) => {
      // set player name in here from the command payload
      const player = this.state.players.get(client.sessionId);
      player.name = commandPayload.name;
      console.log(`player ${player.name} joined the game`);
      this.broadcast(ServerEvents.PlayerDataInitialized, { sessionId: client.sessionId, name: player.name }, { except: client });
    });
  }

  fixedUpdate(timeStep: number) {
    //this.handlePlayerTurn(timeStep);
    this.handleCommands();
  }

  handleCommands() {
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

  handlePlayerTurn(timeStep: number) {
    // Add the timeStep to the turn time counter
    this.turnTimeCounter += timeStep;
    this.turnTimeLeftCounter += timeStep;

    if (this.turnTimeLeftCounter >= this.turnTimeLeftBroadcastTime) {
      this.informClientsAboutTurnTimeLeft();
      this.turnTimeLeftCounter = 0;
    }

    // Check if a minute has passed
    if (this.turnTimeCounter >= this.turnTime) {
      this.changeTurn();
      this.turnTimeCounter = 0;
    }
  }

  informClientsAboutTurnTimeLeft() {
    // Calculate the remaining time in seconds
    let secondsLeft = Math.ceil((this.turnTime - this.turnTimeCounter) / 1000);

    if (secondsLeft < 5) {
      // Broadcast the remaining time
      this.broadcast(ServerEvents.TurnTimeSecondsLeft, secondsLeft);
    }
  }

  changeTurn() {
    let index = 0
    // set the current player session id
    this.state.players.forEach(player => {
      if (index === this.currentPlayerIndex) {
        this.state.currentPlayerSessionId = player.client.sessionId;
        console.log(`now player ${player.client.sessionId}'s turn`)
      }
      index++;
    });

    if (this.currentPlayerIndex === this.state.players.size - 1) {
      this.currentPlayerIndex = 0;
    } else {
      this.currentPlayerIndex++;
    }

    return;
  }

  onJoin(client: Client, _options: any) {
    //console.log(client.sessionId, "joined!");

    const player = new Player(client);
    player.mapPos = new MapPos(MathUtils.getRandomInt(this.state.mapWidth), MathUtils.getRandomInt(this.state.mapHeight));
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  attachGameEvents() {
    this.onMessage(ClientEvents.Input, (client, commandPayload) => {
      console.log(`received input from ${client.sessionId}`)

      // ignore input from other players
      // if (client.sessionId !== this.state.currentPlayerSessionId) {
      //   return;
      // }

      this.handleInput(client, commandPayload)
    });
  }

  handleInput(client: Client, inputCommand: BaseCommandPayload) {
    // handle player input
    const player = this.state.players.get(client.sessionId);

    // enqueue command to player command buffer.
    player.commandPayloadQueue.push(inputCommand);
  }

  // TODO: extract to another place
  buildWorld() {
    var data = [
      [0, 2, 2, 5, 0, 5, 6, 1, 5, 0],
      [5, 4, 1, 7, 4, 0, 0, 0, 5, 1],
      [2, 1, 2, 0, 5, 7, 2, 3, 4, 6],
      [3, 7, 0, 2, 6, 7, 5, 0, 2, 4],
      [6, 6, 2, 2, 1, 3, 4, 2, 4, 5],
      [5, 2, 6, 7, 6, 5, 7, 7, 1, 5],
      [0, 4, 0, 7, 2, 3, 3, 6, 6, 1],
      [2, 2, 5, 7, 2, 2, 7, 5, 2, 6],
      [5, 5, 0, 4, 3, 5, 6, 2, 3, 7],
      [5, 6, 7, 5, 5, 1, 3, 6, 2, 5]
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
