export class Player extends Phaser.GameObjects.Sprite {
    private selectedTile: Phaser.Tilemaps.Tile;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'heroImage');
        this.setOrigin(0.5, 1);
        this.tint = Phaser.Display.Color.RandomRGB().color;
        scene.add.existing(this);
    }

    setSelectedTile(tile: Phaser.Tilemaps.Tile) {
        if (this.selectedTile) {
            this.selectedTile.tint = 0xffffff
            this.selectedTile = null;
        }

        if (tile) {
            this.selectedTile = tile;
            this.selectedTile.tint = 0xcccccc
        }
    }

    getSelectedTile(): Phaser.Tilemaps.Tile {
        return this.selectedTile;
    }
}