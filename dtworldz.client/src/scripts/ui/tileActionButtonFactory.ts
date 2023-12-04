import { ClientPlayer } from "../models/clientPlayer";
import { ClientActionPanel } from "./clientActionPanel";

export class TileActionButtonFactory {
    static getButtons(actionPanel: ClientActionPanel, tile: any, player: ClientPlayer) {
        const scene = actionPanel.scene as any;
        if (!tile) {
            return [];
        }

        let buttons = [];

        // if player has current path, add a move button
        if (actionPanel.player.currentPath && actionPanel.player.currentPath.length > 0) {
            const movebutton = scene.rexUI.add.label({
                width: 60, height: 60,
                background: scene.add.sprite(0, 0, 'actionIcons', 0),
            })

            buttons.push({
                button: movebutton, callBack: () => {
                    (actionPanel.scene as any).gameScene.room.send('ca_action', { aid: 'move', payload: { x: tile.position.x, y: tile.position.y } });
                }
            });
        }

        // if tile has animals,
        // and if player is in this tile,
        // add a hunt button
        if (Object.keys(tile.components).length > 0 &&
            Object.values(tile.components).find((c: any) => c.name === 'Deers') &&
            tile.position.x === player.client.position.x && tile.position.y === player.client.position.y) {
            const huntButton = scene.rexUI.add.label({
                width: 60, height: 60,
                background: scene.add.sprite(0, 0, 'actionIcons', 1),
            })

            buttons.push({
                button: huntButton, callBack: () => {
                    (actionPanel.scene as any).gameScene.room.send('ca_action', { aid: 'hunt', payload: { component: 'Deers', position: { x: tile.position.x, y: tile.position.y } } });
                }
            });
        }


        return buttons;
    }
}