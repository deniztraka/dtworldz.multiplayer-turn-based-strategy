import { WorldRoomOld } from "../rooms/WorldRoomOld"
import {Player} from "../schema/WorldState";

export interface ICommand {
    execute(worldRoom: WorldRoomOld, player: Player): void
    tick: number
}