import { WorldRoom } from "../rooms/WorldRoom"
import {Player} from "../schema/WorldState";

export interface ICommand {
    execute(worldRoom: WorldRoom, player: Player): void
    tick: number
}