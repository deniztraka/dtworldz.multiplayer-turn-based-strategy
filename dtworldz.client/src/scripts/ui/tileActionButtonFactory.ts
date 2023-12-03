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
                background: scene.add.sprite(0,0, 'actionIcons', 0),
                // text: scene.add.text(0, 0, "text", {
                //     fontSize: 18
                // })
            })

            buttons.push({
                button: movebutton, callBack: () => {
                    (actionPanel.scene as any).gameScene.room.send('ca_action', { aid: 'move', payload: { x: tile.position.x, y: tile.position.y } });
                    actionPanel.player.setSelectedTile(null);
                    actionPanel.player.clearActions();
                }
            });
        }


        return buttons;
    }
}