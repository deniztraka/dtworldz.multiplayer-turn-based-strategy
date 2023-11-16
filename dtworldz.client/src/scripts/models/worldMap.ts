import { PathFinder } from "../helpers/pathfinder"
import { WorldMapHelper } from "../helpers/worldMapHelper"
import { GameScene } from "../scenes/GameSceneOld"


export class WorldMap {
    game: Phaser.Scene
    width: integer
    height: integer
    floorLayer: Phaser.Tilemaps.TilemapLayer
    pathfinder: PathFinder
    data: number[][]

    constructor(game: GameScene) {
        this.game = game
        this.height = game.room.state.mapHeight
        this.width = game.room.state.mapWidth
        this.data = WorldMapHelper.convertToMapData(game.room.state.mapData, this.width, this.height);
        this.build()
        this.pathfinder = new PathFinder(this.data);
    }

    build() {
        const mapData = new Phaser.Tilemaps.MapData({
            width: 10,
            height: 10,
            tileWidth: 64,
            tileHeight: 32,
            orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
            format: Phaser.Tilemaps.Formats.ARRAY_2D
        });

        const map = new Phaser.Tilemaps.Tilemap(this.game, mapData);

        const tilesetImage = map.addTilesetImage('tilesetImage', 'tileAtlas', 64, 96,0,0);

        this.floorLayer = map.createBlankLayer('floorLayer', tilesetImage, 350, 200);


        let y = 0;

        this.data.forEach(row => {

            row.forEach((index, x) => {
                let tile = this.floorLayer.putTileAt(index, x, y);
                tile.properties.isSelected = false;
            });

            y++;

        });

        // const map = this.game.make.tilemap({ key:'testMapJSON'});
        // const tileSet = map.addTilesetImage('newworldinit', 'tileAtlas');
        // this.floorLayer = map.createLayer(0, tileSet, 350, 200);
    }
}