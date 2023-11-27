import { ClientPlayer } from "../models/clientPlayer";
import { CharacterPanel } from "./characterPanel";

export class RemoteCharacterPanel extends CharacterPanel {
    constructor(scene: any, player: ClientPlayer, x: number, y: number) {
        super(scene, player, x, y, false);
        this.x = x;
        this.y = y;
        this.create();
        scene.add.existing(this);
    }
}