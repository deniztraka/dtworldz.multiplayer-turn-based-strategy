export class WorldTile extends Phaser.Tilemaps.Tile {
    constructor(layer: Phaser.Tilemaps.LayerData, index: number, x: number, y: number) {
        super(layer, index, x, y, 32, 16, 32, 16);
        this.properties = {
            isSelected: false
        }
    }

    setSelected(){
        console.log("asdasdasd");
    }
}