import { IPoint } from "../interfaces/ipoint";
import { GameScene } from "../scenes/GameScene";

export class Player extends Phaser.GameObjects.Sprite {
    
    private selectedTile: Phaser.Tilemaps.Tile;
    client: any;
    sessionId: any;
    currentPath: IPoint[];
    markers: any;
    constructor(scene: GameScene, client:any, sessionId:any, x: number, y: number) {
        super(scene, x, y, 'heroImage');
        this.client = client;
        this.sessionId = sessionId;
        this.setOrigin(0.5, 1);
        this.tint = Phaser.Display.Color.RandomRGB().color;
        this.currentPath = [];
        scene.add.existing(this);
    }

    setPath(currentPath: IPoint[]) {
        this.currentPath = currentPath;
    }

    // moves the player to the next point in the path
    followPath() {
        if (this.currentPath.length > 0) {
            this.scene.events.emit('pausePlayerInput');
            const nextPoint = this.currentPath.shift();

            const tile = (<GameScene>this.scene).worldMap.floorLayer.getTileAt(nextPoint.x, nextPoint.y);

            const distance = Phaser.Math.Distance.Between(this.x, this.y, tile.getCenterX(), tile.getCenterY());
            const duration = distance * 10;
            this.scene.tweens.add({
                targets: this,
                x:  tile.getCenterX(),
                y: tile.getCenterY(),
                duration: duration,
                onComplete: () => {
                    if(this.markers){
                        let marker = this.markers.shift();
                        if(marker){
                            marker.destroy();
                        }
                    }
                    

                    this.followPath();
                }
            });
        } else {
            this.scene.events.emit('releasePlayerInput');
        }
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