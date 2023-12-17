import Anchor from "phaser3-rex-plugins/plugins/anchor";

export class TilePropsPanel extends Phaser.GameObjects.Container {
    sizer: any;
    biomeText: any;
    natureText: any;
    componentsText: any;
    bg: any;
    constructor(scene: any, x: number, y: number) {
        super(scene, x, y);
        this.bg = scene.rexUI.add.roundRectangle(0, 0, 300, 75, 0, 0x000000).setAlpha(0).setOrigin(0, 1);

        this.biomeText = (this.scene as any).rexUI.add.textBox({
            x: 10, y: -60,
            width: 300,
            align: 'center',
            text: this.scene.add.text(0, 0, '', {
                fontSize: 18,
                wordWrap: { width: 300 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#eeeeee',
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 0, innerRight: 2, innerTop: 0, innerBottom: 2,
            }
        }).setOrigin(0, 0).layout();

        this.natureText = (this.scene as any).rexUI.add.textBox({
            x: 10, y: -40,
            width: 300,
            align: 'center',
            text: this.scene.add.text(0, 0, '', {
                fontSize: 18,
                wordWrap: { width: 300 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#eeeeee',
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 0, innerRight: 2, innerTop: 0, innerBottom: 2,
            }
        }).setOrigin(0, 0).layout();

        this.componentsText = (this.scene as any).rexUI.add.textBox({
            x: 10, y: -20,
            width: 300,
            align: 'center',
            text: this.scene.add.text(0, 0, '', {
                fontSize: 16,
                wordWrap: { width: 300 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#eeeeee',
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 0, innerRight: 2, innerTop: 0, innerBottom: 2,
            }
        }).setOrigin(0, 0).layout();

        this.add(this.bg);
        this.add(this.biomeText);
        this.add(this.natureText);
        this.add(this.componentsText);

        scene.add.existing(this);
        new Anchor(this, { left: 'left+10', bottom: 'bottom-10' });
    }

    setTile(tile: any) {
        if (tile) {
            this.bg.setAlpha(0.5);
            this.biomeText.setText(`${tile.name ? tile.name + ' biome' : ''}`);
            this.natureText.setText(`${tile.natureDisplayName ? tile.natureDisplayName : ''}`);
            let components: string[] = [];
            Object.keys(tile.components).forEach((key) => {
                components.push(key);
            });
            this.componentsText.setText(`${components.length > 0 ? 'Has ' + components.join(', ') : 'Has nothing useful' }`);
        } else {
            this.biomeText.setText('');
            this.natureText.setText('');
            this.componentsText.setText('');
            this.bg.setAlpha(0);
        }
    }
}