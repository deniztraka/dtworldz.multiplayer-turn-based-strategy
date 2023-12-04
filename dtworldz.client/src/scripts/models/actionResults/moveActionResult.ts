import { PopUpMessageHandler } from "../../handlers/ui/popUpMessageHandler";
import { BaseActionResult } from "./baseActionResult";

export class MoveActionResult extends BaseActionResult {
    execute(): void {
        if(this.payload.result){
            this.player.setSelectedTile(null);
            this.player.clearActions();
        } else {
            PopUpMessageHandler.create(this.scene.scene.get('GameRunningUIScene'), 'I am not able to move further.');
        }
    }
}