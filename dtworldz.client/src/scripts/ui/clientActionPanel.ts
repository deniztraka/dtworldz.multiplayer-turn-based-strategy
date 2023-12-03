import Button from "phaser3-rex-plugins/plugins/button";
import { ClientPlayer } from "../models/clientPlayer";
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';
import { Label } from "phaser3-rex-plugins/templates/ui/ui-components";
import { TileActionButtonFactory } from "./TileActionButtonFactory";


const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class ClientActionPanel extends Phaser.GameObjects.Container {

    player: ClientPlayer;
    isLocal: boolean;
    actionButtonCallbacks: any[];
    actionButtons: any;
    constructor(scene: any, player: ClientPlayer, x: number, y: number) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.player = player;
        this.actionButtonCallbacks = [];
        scene.add.existing(this);
        new Anchor(this, { centerX: 'center', bottom: 'bottom' });
    }

    setActions(tile: any) {
        setTimeout(() => {
            this.refreshActionsPanel(tile);
        }, 500);
    }

    private refreshActionsPanel(tile: any) {
        const scene = this.scene as any;

        if (this.actionButtons) {
            this.actionButtons.destroy();
            this.actionButtons = null;
        }

        this.actionButtons = scene.rexUI.add.fixWidthButtons({
            x: 0, y: -35,
            width: undefined, height: 70,
            anchor: {
                width: '50%',
            },

            background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 0, COLOR_DARK).setAlpha(0),
            buttons: this.initActionButtons(tile),
            align: 'center',
            space: {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5,
                //item: -5,
                //indentTopEven: 20,
            },
        })
            .layout()
        // .drawBounds(this.add.graphics(), 0xff0000);

        const self = this;
        this.actionButtons
            .on('button.click', function (button: any, index: any, pointer: any, event: any) {
                self.actionButtonCallbacks[index](self.player.getSelectedTile());
                event.stopPropagation();
            })
            .on('button.out', function (button: any, index: any, pointer: any, event: any) {
                //button.getElement('background').setStrokeStyle();
            })
            .on('button.over', function (button: any, index: any, pointer: any, event: any) {
                //button.getElement('background').setStrokeStyle(2, 0xffffff);

            })
        this.add(this.actionButtons);
    }



    private initActionButtons(tile: any) {
        if (!tile) {
            return [];
        }

        const buttons: any[] = [];
        this.actionButtonCallbacks = [];

        const actionButtons =  TileActionButtonFactory.getButtons(this, tile, this.player);
        actionButtons.forEach(element => {
            buttons.push(element.button);
            this.actionButtonCallbacks.push(element.callBack);
        });

        return buttons;
    }
}