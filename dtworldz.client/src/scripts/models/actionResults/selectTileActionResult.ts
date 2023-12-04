import { PopUpMessageHandler } from "../../handlers/ui/popUpMessageHandler";
import { BaseActionResult } from "./baseActionResult";

export class SelectTileActionResult extends BaseActionResult {
    execute(): void {
        if(this.payload.result){
            console.log(this.payload.target);
        } else {
            PopUpMessageHandler.create(this.scene.scene.get('GameRunningUIScene'), 'Something wrong with it.');
        }
    }
}