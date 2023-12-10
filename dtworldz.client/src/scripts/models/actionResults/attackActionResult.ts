import { PopUpMessageHandler } from "../../handlers/ui/popUpMessageHandler";
import { BaseActionResult } from "./baseActionResult";

export class AttackActionResult extends BaseActionResult {
    execute(): void {
        if(this.payload.result){
            this.player.setSelectedTile(null);
            this.player.clearPath();
            this.player.clearActions();

            //console.log(this.payload.targetSessionId);

            const targetPlayer = this.scene.players[this.payload.targetSessionId];

            //console.log(this.player.container.x + ' ' + this.player.container.y);
            

            //this.scene.add.existing(this.scene.add.text(targetPlayer.container.x, targetPlayer.container.y, this.payload.damage, { fontFamily: 'Arial', fontSize: 12, color: '#ff0000' }));

            this.scene.sound.play('attack', { volume: 1 });

            this.scene.tweens.add({
                targets: this.player.container,
                x: targetPlayer.container.x,
                y: targetPlayer.container.y,
                duration: 100,
                yoyo: true,
                repeat: 0,
                onComplete: () => {

                    if(this.player.sessionId === this.scene.localPlayer.sessionId){

                        PopUpMessageHandler.create(this.scene, '-' + this.payload.damage, '#ff0000', 1000, targetPlayer.container.x, targetPlayer.container.y - 32 - 16, 8);
                    }
                }
            });



        } else if (this.scene.localPlayer.sessionId === this.scene.room.sessionId) {
            PopUpMessageHandler.create(this.scene.scene.get('GameRunningUIScene'), this.payload.message ? this.payload.message :  "I couldn't make that happen.");
        }
    }
}