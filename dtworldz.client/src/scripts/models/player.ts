import { Game } from "phaser";
import { IPoint } from "../interfaces/ipoint";
import { GameScene } from "../scenes/GameSceneOld";

export class Player extends Phaser.GameObjects.Container {

    private selectedTile: Phaser.Tilemaps.Tile;
    client: any;
    sessionId: any;
    currentPath: IPoint[];
    markers: any;
    playerName: any;
    characterSprite: any;
    playerNameText: Phaser.GameObjects.Text;
    constructor(scene: GameScene, client: any, sessionId: any, x: number, y: number) {
        super(scene, x, y);
        let add = scene.add;
        this.client = client;
        this.sessionId = sessionId;
        this.playerName = client.name;
        this.currentPath = [];
        this.characterSprite = (add as any).sprite(0, 0, 'heroImage');
        this.characterSprite.setOrigin(0.5, 0.75);
        //this.characterSprite.tint = client.color;
        this.playerNameText = add.text(0, -90, this.playerName, { color: "#000000", fontSize: "12px", fontStyle:'bold', fontFamily: 'Arial', padding: { left: 40, right: 40, top: 5, bottom: 5, } }).setOrigin(0.5, 1);
        this.add(this.playerNameText);
        this.add(this.characterSprite);
        scene.add.existing(this);
    }

    setPath(currentPath: IPoint[]) {
        this.currentPath = currentPath;
    }
    setPlayerName(playerName: string) {
        this.playerName = playerName;
        
            this.playerNameText.setText(playerName);
        
    }

    // moves the player to the next point in the path
    followPath() {
        if (this.currentPath.length > 0) {
            this.scene.events.emit('pausePlayerInput');
            const nextPoint = this.currentPath.shift();

            const tile = (<GameScene>this.scene).worldMap.floorLayer.getTileAt(nextPoint.x, nextPoint.y);

            const distance = Phaser.Math.Distance.Between(this.x, this.y, tile.getCenterX(), tile.getCenterY());
            const duration = distance * 10;

            // set player rotation to match movement
            var radRotation = Phaser.Math.Angle.Between(this.x, this.y, tile.getCenterX(), tile.getCenterY());
            let angle = Phaser.Math.RadToDeg(radRotation);
            angle += 90;
            angle = Math.ceil(angle);
            //this.characterSprite.angle = angle;

            this.characterSprite.flipX = [-63, 244, 270].indexOf(angle) > -1

            this.scene.tweens.add({
                targets: this,
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