import { Game } from "phaser";
import { IPoint } from "../interfaces/ipoint";
import { GameIsRunningScene } from "../scenes/GameIsRunningScene";

export class ClientPlayer extends Phaser.GameObjects.Container {

    private selectedTile: Phaser.Tilemaps.Tile;
    client: any;
    sessionId: any;
    currentPath: IPoint[];
    markers: any;
    playerName: any;
    characterSprite: any;
    playerNameText: Phaser.GameObjects.Text;
    constructor(scene: GameIsRunningScene, client: any, sessionId: any, x: number, y: number) {
        super(scene, x, y);
        let add = scene.add;
        this.client = client;
        this.sessionId = sessionId;
        this.playerName = client.name;
        this.currentPath = [];
        this.characterSprite = (add as any).sprite(0, 0, 'hero'+client.charIndex).setScale(0.5);
        this.characterSprite.setOrigin(0.5, 0.75);
        this.playerNameText = add.text(0, -60, this.playerName, { color: "#cccccc", fontSize: "8px", fontFamily: 'DTSubTitleFontFamily', padding: { left: 0, right: 0, top: 0, bottom: 0, } }).setOrigin(0.5, 0.5);
        this.add(this.playerNameText);
        this.add(this.characterSprite);
        scene.add.existing(this);

        this.listenServerUpdates();
    }

    listenServerUpdates() {
        this.client.listen("position", (currentValue: any, previousValue: any) => {
            // check if there is a path to follow and last point in the path equals to the current position
            if (this.currentPath.length > 0 && this.currentPath[this.currentPath.length - 1].x === currentValue.x && this.currentPath[this.currentPath.length - 1].y === currentValue.y) {
                // console.log(`moving player ${player.sessionId} to next point`);
                this.move(currentValue);
            }
        });
    }

    move(tilePos: { x: number, y: number }) {
        // get tile from current position
        const tile = (<GameIsRunningScene>this.scene).floorMap.getTileAt(tilePos.x, tilePos.y);

        this.scene.tweens.add({
            targets: this,
            x: tile.getCenterX(),
            y: tile.getCenterY(),
            duration: 100,
            onComplete: () => {
                if (this.markers) {
                    let marker = this.markers.shift();
                    if (marker) {
                        marker.destroy();
                    }
                }
            }
        });
    }

    setPath(currentPath: IPoint[]) {
        this.currentPath = currentPath;
    }

    // moves the player to the next point in the path
    // followPath() {
    //     if (this.currentPath.length > 0) {
    //         this.scene.events.emit('pausePlayerInput');
    //         const nextPoint = this.currentPath.shift();

    //         const tile = (<GameScene>this.scene).worldMap.floorLayer.getTileAt(nextPoint.x, nextPoint.y);

    //         const distance = Phaser.Math.Distance.Between(this.x, this.y, tile.getCenterX(), tile.getCenterY());
    //         const duration = distance * 10;

    //         // set player rotation to match movement
    //         var radRotation = Phaser.Math.Angle.Between(this.x, this.y, tile.getCenterX(), tile.getCenterY());
    //         let angle = Phaser.Math.RadToDeg(radRotation);
    //         angle += 90;
    //         angle = Math.ceil(angle);
    //         //this.characterSprite.angle = angle;

    //         this.characterSprite.flipX = [-63, 244, 270].indexOf(angle) > -1

    //         this.scene.tweens.add({
    //             targets: this,
    //             x: tile.getCenterX(),
    //             y: tile.getCenterY(),
    //             duration: duration,
    //             onComplete: () => {
    //                 if (this.markers) {
    //                     let marker = this.markers.shift();
    //                     if (marker) {
    //                         marker.destroy();
    //                     }
    //                 }

    //                 this.followPath();
    //             }
    //         });
    //     } else {
    //         this.scene.events.emit('releasePlayerInput');
    //     }
    // }

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