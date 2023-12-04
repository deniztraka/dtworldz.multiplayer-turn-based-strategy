import { GameIsRunningScene } from "../../scenes/GameIsRunningScene";
import { ClientPlayer } from "../clientPlayer";

export abstract class BaseActionResult {
    scene: GameIsRunningScene;
    player: ClientPlayer;
    payload: any;
    constructor(scene:GameIsRunningScene, player: ClientPlayer,  payload: any) {
        this.scene = scene;
        this.player = player;
        this.payload = payload;
    }
    abstract execute(scene: GameIsRunningScene, player: ClientPlayer): void;
}