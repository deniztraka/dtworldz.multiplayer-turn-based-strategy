import { WorldRoom } from "../../rooms/dtWorldz";
import { Player } from "../../schema/mobiles/player";
import { GameIsEndedState } from "../../states/gameIsEndedState";
import { RunningGameLogicState } from "../../states/runningGameLogicState";

export class TurnManager {
    
    
    private currentPlayerIndex: number;
    private turnDuration: number;
    private elapsedTime: number;
    private gameRoom: WorldRoom;
    private lastBroadcastTime: number;
    skipTurnList: any;

    constructor(gameRoom: WorldRoom, turnDuration = 60000) {
        this.gameRoom = gameRoom;
        this.currentPlayerIndex = 0;
        this.turnDuration = turnDuration;
        this.elapsedTime = 0;
        this.lastBroadcastTime = 0;
        this.skipTurnList = [];
    }

    startTurn() {
        this.elapsedTime = 0;
        this.lastBroadcastTime = 0;

        //console.log(`Turn started for player: ${this.getCurrentPlayer().name}`);
        this.gameRoom.broadcast('sa_turn-start', { currentPlayerSessionId: this.getCurrentPlayer().client.sessionId });
    }

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.turnDuration) {
            this.nextTurn();
        } else if (this.elapsedTime - this.lastBroadcastTime >= 1000) {
            let timeLeft = Math.floor((this.turnDuration - this.elapsedTime));
            this.gameRoom.broadcast('sa_turnTimeLeft', { timeLeft: Math.floor(timeLeft / 1000), totalTime: this.turnDuration /1000 });
            const currentPlayer = this.getCurrentPlayer();
            if(currentPlayer){
                //console.log(`Time left for ${this.getCurrentPlayer().name}: ${timeLeft} seconds`);
            }else {
                //console.log(`Time left for not existing user: ${timeLeft} seconds`);
                this.nextTurn(true);
            }
            this.lastBroadcastTime = this.elapsedTime;
        }
    }

    setSkipTurnFor(sessionId: string) {
        this.skipTurnList.push(sessionId);
        
    }

    nextTurn(force: boolean = false) {
        const players = Array.from(this.gameRoom.getPlayers().values());

        

        if(players.length === 1 && !force){
            return;
        }

        const currentState = this.gameRoom.getCurrentGameLogicState();
        if(currentState instanceof RunningGameLogicState){
            if(currentState.isAllDead()){
                this.gameRoom.changeState(new GameIsEndedState(this.gameRoom));
                return;
            }
            currentState.handleTurnProcess();
        }

        

        this.currentPlayerIndex = this.tryGetNextPlayerIndex() || 0;
        this.startTurn();
    }

    tryGetNextPlayerIndex(): number | undefined {
        // recuresively try to get next player index until we find one that is not in skipTurnList, if we can't find one return undefined
        const players = Array.from(this.gameRoom.getPlayers().values());
        const nextPlayerIndex = (this.currentPlayerIndex + 1) % players.length;
        if(this.skipTurnList.includes(players[nextPlayerIndex].sessionId)){
            this.currentPlayerIndex = nextPlayerIndex;
            return this.tryGetNextPlayerIndex();
        } else {
            return nextPlayerIndex;
        }
        
    }

    getCurrentPlayer() : Player {
        const players = Array.from(this.gameRoom.getPlayers().values());
        return players[this.currentPlayerIndex] as Player;
    }
}
