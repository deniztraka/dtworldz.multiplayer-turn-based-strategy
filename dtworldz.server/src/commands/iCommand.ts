import { WorldRoom } from "../rooms/WorldRoom"
import {Player} from "../rooms/WorldState";

export interface ICommand {
    execute(worldRoom: WorldRoom, player: Player): void
    tick: number
}