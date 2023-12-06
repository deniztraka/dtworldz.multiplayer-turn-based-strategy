import { PopUpMessageHandler } from "../../handlers/ui/popUpMessageHandler";
import { BaseActionResult } from "./baseActionResult";

export class SelectTileActionResult extends BaseActionResult {
    execute(): void {
        if(this.payload.result){
            this.player.clearActions();
            // console.log(this.payload.target);
            this.scene.events.emit('tile-props', this.payload.target);
        } else {
            PopUpMessageHandler.create(this.scene.scene.get('GameRunningUIScene'), this.payload.message ? this.payload.message : 'Something wrong with it.');
        }
    }
}