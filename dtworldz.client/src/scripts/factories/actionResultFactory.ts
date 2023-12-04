import { HuntActionResult } from "../models/actionResults/huntActionResult";
import { MoveActionResult } from "../models/actionResults/moveActionResult";
import { SelectTileActionResult } from "../models/actionResults/selectTileActionResult";
import { ClientPlayer } from "../models/clientPlayer";
import { GameIsRunningScene } from "../scenes/GameIsRunningScene";

export class ActionResultFactory {

    static get(scene:GameIsRunningScene, player: ClientPlayer, actionResult: { aid: string, payload: any }) {
        switch (actionResult.aid) {
            case 'hunt':
                return new HuntActionResult(scene, player, actionResult.payload);
            case 'move':
                return new MoveActionResult(scene, player, actionResult.payload);
            case 'select-tile':
                return new SelectTileActionResult(scene, player, actionResult.payload);
            // case 'next-turn-request':
            //     return new NextTurnRequestActionResult(actionResult);
        }
    }
}