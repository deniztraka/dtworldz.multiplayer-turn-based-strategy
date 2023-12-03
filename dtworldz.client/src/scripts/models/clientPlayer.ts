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
    hunger: number;
    characterSprite: any;
    playerNameText: Phaser.GameObjects.Text;
    container: Phaser.GameObjects.Container;
    scene: GameIsRunningScene;
    x: number;
    y: number;
    health: number;
    energy: number;
    constructor(scene: GameIsRunningScene, client: any, sessionId: any, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y
        this.container = scene.add.container(x, y);
        this.client = client;
        this.sessionId = sessionId;
        this.playerName = client.name;
        this.currentPath = [];
        this.characterSprite = scene.add.sprite(0, 0, 'char', client.charIndex).setOrigin(0.5, 1);
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

        this.client.listen("isMoving", (currentValue: boolean, previousValue: boolean) => {
            if (previousValue) {
                // destroy markers
                if (this.markers) {
                    this.markers.forEach((marker: any) => {
                        marker.destroy();
                    });
                    this.markers = [];
                }
            }
        });

    }

    move(tilePos: { x: number, y: number }) {
        // get tile from current position
        const tile = (<GameIsRunningScene>this.scene).floorLayer.getTileAt(tilePos.x, tilePos.y);

        //const distance = Phaser.Math.Distance.Between(this.x, this.y, tile.getCenterX(), tile.getCenterY());

        const duration = 1000 / this.client._speed;

        this.scene.tweens.add({
            targets: this.container,
            x: tile.getCenterX(),
            y: tile.getCenterY(),
            duration: duration,
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

        let paths = this.currentPath.map((pathItem: any, index: number) => {
            return { pos: { x: pathItem.position.x, y: pathItem.position.y }, cost: pathItem.cost };
        });

        if(paths.length === 0){
            return;
        }

        let totalCost = 0;

        // if(paths.length >= 2){
        //     totalCost = paths[1].cost;
        // }
        

        // draw markers
        paths.forEach((path: any, index) => {
            // skip first and last
            if (index === 0) {
                return;
            }

            const scene = (this.scene as GameIsRunningScene)
            //draw marker
            var tile = scene.floorLayer.getTileAt(path.pos.x, path.pos.y);
            if (tile.index !== -1) {
                let container = this.scene.add.container(tile.getCenterX(), tile.getCenterY());
                var markerImage = 'marker';
                if(index === paths.length - 1){
                    markerImage = 'target'
                }
                var marker = scene.add.image(0, 0, markerImage).setScale(1).setTint(0x3bdef3);
                marker.setDepth(100);

                totalCost += path.cost;


                var text = scene.add.text(10, 0, totalCost.toString(), { color: "#ffffff", fontSize: "8px", fontFamily: 'DTBodyTextFamily', padding: { left: 0, right: 0, top: 0, bottom: 0, } }).setOrigin(0.5, 0.5);

                // set marker rotation to match the tile
                if (index < this.currentPath.length - 1) {
                    let nextItem: any = paths[index + 1];
                    var nextTile = scene.floorLayer.getTileAt(nextItem.pos.x, nextItem.pos.y);
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

                

                if (totalCost > this.client._energy) {
                    marker.setTint(0xff0000);
                    text.setColor("#ff0000");
                }

                container.add([marker, text]);
                this.markers.push(container);
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