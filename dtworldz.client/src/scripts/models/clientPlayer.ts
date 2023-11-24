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
        this.characterSprite = (add as any).sprite(0, 0, 'hero' + client.charIndex).setScale(0.5);
        this.characterSprite.setOrigin(0.5, 0.75);
        this.playerNameText = add.text(0, -60, this.playerName, { color: "#cccccc", fontSize: "8px", fontFamily: 'DTSubTitleFontFamily', padding: { left: 0, right: 0, top: 0, bottom: 0, } }).setOrigin(0.5, 0.5);
        this.add(this.playerNameText);
        this.add(this.characterSprite);
        scene.add.existing(this);

        this.listenServerUpdates();
    }

    listenServerUpdates() {
        this.client.listen("position", (currentValue: {x: number, y: number}, previousValue: any) => {
            //console.log(`moving player ${this.sessionId} to the point ${currentValue.x} ${currentValue.y}`)
            this.move(currentValue);
        });

        this.client.listen("currentPath", (currentValue: any, previousValue: any) => {
            this.currentPath = currentValue;
            if((this.scene as GameIsRunningScene).localPlayer.sessionId === this.sessionId ){
                this.drawPath();
            }
        });
    }

    move(tilePos: { x: number, y: number }) {
        // get tile from current position
        const tile = (<GameIsRunningScene>this.scene).floorMap.getTileAt(tilePos.x, tilePos.y);

        const distance = Phaser.Math.Distance.Between(this.x, this.y, tile.getCenterX(), tile.getCenterY());


        this.scene.tweens.add({
            targets: this,
            x: tile.getCenterX(),
            y: tile.getCenterY(),
            duration:  1000 / this.client.speed,// this.client.speed,
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

    drawPath() {
        // clear markers
        if (this.markers) {
            this.markers.forEach((marker: any) => {
                marker.destroy();
            });
        }
        this.markers = [];

        let paths = this.currentPath.map((pathItem: IPoint, index: number) => {
            return { x: pathItem.x, y: pathItem.y };
        });

        // draw markers
        paths.forEach((path, index) => {
            // skip first and last
            if (index === 0) {
                return;
            } 

            const scene = (this.scene as GameIsRunningScene)
            //draw marker
            var tile = scene.floorMap.getTileAt(path.x, path.y);
            if (tile.index !== -1) {
                var marker = scene.add.image(tile.getCenterX(), tile.getCenterY(), 'markerImage').setScale(2);
                marker.setDepth(100);
                // set marker rotation to match the tile
                if (index < this.currentPath.length - 1) {
                    let nextItem = paths[index + 1];
                    var nextTile = scene.floorMap.getTileAt(nextItem.x, nextItem.y);
                    if (nextTile.index !== -1) {
                        var radRotation = Phaser.Math.Angle.Between(tile.getCenterX(), tile.getCenterY(), nextTile.getCenterX(), nextTile.getCenterY());
                        let angle = Phaser.Math.RadToDeg(radRotation);
                        angle += 90;
                        marker.setAngle(angle);
                        angle = Math.ceil(angle);
                        if (this.characterSprite) {
                            this.characterSprite.flipX = [-63, 244, 270].indexOf(angle) > -1
                        }
                    }
                }
                this.markers.push(marker);
            }
        });
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