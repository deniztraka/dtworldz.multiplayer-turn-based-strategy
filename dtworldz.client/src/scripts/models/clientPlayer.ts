import { Game } from "phaser";
import { IPoint } from "../interfaces/ipoint";
import { GameIsRunningScene } from "../scenes/GameIsRunningScene";

export class ClientPlayer {

    private selectedTile: Phaser.Tilemaps.Tile;
    client: any;
    sessionId: any;
    currentPath: IPoint[];
    markers: any;
    playerName: any;
    characterSprite: any;
    playerNameText: Phaser.GameObjects.Text;
    container: Phaser.GameObjects.Container;
    scene: GameIsRunningScene;
    x: number;
    y: number;
    constructor(scene: GameIsRunningScene, client: any, sessionId: any, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y
        this.container = scene.add.container(x, y);
        this.client = client;
        this.sessionId = sessionId;
        this.playerName = client.name;
        this.currentPath = [];
        this.characterSprite = scene.add.sprite(0, 0, 'char', 0).setOrigin(0.5, 1);
        this.playerNameText = scene.add.text(0, -40, this.playerName, { color: "#ffffff", fontSize: "8px", fontFamily: 'DTBodyTextFamily', padding: { left: 0, right: 0, top: 0, bottom: 0, } }).setOrigin(0.5, 0.5);

        // if(this.scene.localPlayer.sessionId === this.sessionId){
        //     this.characterSprite.setTint(0x00ff00);
        // }


        this.container.add([this.characterSprite, this.playerNameText]);

        this.listenServerUpdates();
    }

    listenServerUpdates() {
        this.client.listen("position", (currentValue: { x: number, y: number }, previousValue: any) => {
            //console.log(`moving player ${this.sessionId} to the point ${currentValue.x} ${currentValue.y}`)
            this.move(currentValue);
        });

        this.client.listen("currentPath", (currentValue: any, previousValue: any) => {
            this.currentPath = currentValue;
            if ((this.scene as GameIsRunningScene).localPlayer.sessionId === this.sessionId) {
                this.drawPath();
            }
        });
    }

    move(tilePos: { x: number, y: number }) {
        // get tile from current position
        const tile = (<GameIsRunningScene>this.scene).floorLayer.getTileAt(tilePos.x, tilePos.y);

        const distance = Phaser.Math.Distance.Between(this.x, this.y, tile.getCenterX(), tile.getCenterY());


        this.scene.tweens.add({
            targets: this.container,
            x: tile.getCenterX(),
            y: tile.getCenterY(),
            duration: 1000 / this.client.speed,// this.client.speed,
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
            var tile = scene.floorLayer.getTileAt(path.x, path.y);
            if (tile.index !== -1) {
                var marker = scene.add.image(tile.getCenterX(), tile.getCenterY(), 'markerImage').setScale(2);
                marker.setDepth(100);
                // set marker rotation to match the tile
                if (index < this.currentPath.length - 1) {
                    let nextItem = paths[index + 1];
                    var nextTile = scene.floorLayer.getTileAt(nextItem.x, nextItem.y);
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

    destroy() {
        this.container.destroy();
    }
}