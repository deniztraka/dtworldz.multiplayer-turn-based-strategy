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
            }).setAlpha(0.75).setScale(1.25);

            buttons.push({
                button: movebutton, callBack: () => {
                    scene.gameScene.room.send('ca_action', { aid: 'move', payload: { x: tile.position.x, y: tile.position.y } });
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
            }).setAlpha(0.75).setScale(1.25);

            buttons.push({
                button: huntButton, callBack: () => {
                    scene.gameScene.room.send('ca_action', { aid: 'hunt', payload: { component: 'Deers', position: { x: tile.position.x, y: tile.position.y } } });
                }
            });
        }

        // if tile has players and current player position is the neighbor of this tile,
        // add attack button
        // get players which are in the same position as the tile
        const otherPlayer = Object.values(scene.gameScene.players).find((p: any) => p.client.sessionId !== player.client.sessionId && p.client.position.x === tile.position.x && p.client.position.y === tile.position.y) as ClientPlayer;
        //console.log(otherPlayer);
        if(otherPlayer){
            // check if other player is in the neighbor of current player position
            const otherPlayerPosition = otherPlayer.client.position;
            const playerPosition = player.client.position;
            const isNeighbor = Math.abs(otherPlayerPosition.x - playerPosition.x) <= 1 && Math.abs(otherPlayerPosition.y - playerPosition.y) <= 1;
            if(isNeighbor){
                const attackButton = scene.rexUI.add.label({
                    width: 60, height: 60,
                    background: scene.add.sprite(0, 0, 'actionIcons', 2),
                }).setAlpha(0.75).setScale(1.25);

                buttons.push({
                    button: attackButton, callBack: () => {
                        scene.gameScene.room.send('ca_action', { aid: 'attack', payload: { toMobileSessionId: otherPlayer.client.sessionId } });
                    }
                });
            }
        }

        return buttons;
    }
}