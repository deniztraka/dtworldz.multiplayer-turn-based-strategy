import { PopUpMessageHandler } from "../../handlers/ui/popUpMessageHandler";
import { BaseActionResult } from "./baseActionResult";

export class HuntActionResult extends BaseActionResult {
    execute(): void {
        if(this.payload.result){
            this.player.setSelectedTile(null);
            this.player.clearPath();
            this.player.clearActions();
            PopUpMessageHandler.create(this.scene.scene.get('GameRunningUIScene'), this.payload.message ? this.payload.message : "That was a good hunt.");
            this.scene.soundManager.play('hitAnimal', this.player.container.x, this.player.container.y);

        } else if (this.scene.localPlayer.sessionId === this.scene.room.sessionId) {
            PopUpMessageHandler.create(this.scene.scene.get('GameRunningUIScene'), this.payload.message ? this.payload.message :  "I ccouldn't make it.");
        }
    }
}