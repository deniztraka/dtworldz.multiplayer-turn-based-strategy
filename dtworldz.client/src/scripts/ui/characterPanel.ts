import { ClientPlayer } from "../models/clientPlayer";

export class CharacterPanel extends Phaser.GameObjects.Container {
    private player: ClientPlayer;
    private healthBarImg: any;
    isLocal: boolean;
    turnImage: Phaser.GameObjects.Image;
    constructor(scene: any, player: ClientPlayer, x: number, y: number, isLocal: boolean) {
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.player = player;
        this.isLocal = isLocal;
        this.width = 225;
        this.create();
        scene.add.existing(this);
    }

    

    create() {
        if (this.isLocal) {
            this.createLocalCharacterPanel();
        } else {
            this.createRemoteCharacterPanel();
        }



        this.scene.events.on('turn-start', (player: ClientPlayer) => {
            //TODO: SET TURN SIGN GREEN IF ACTIVE, IF NOT SET IT TO RED
            // if(player.sessionId === this.player.sessionId){
            //     this.turnImage = this.scene.add.image(0, 0, 'turnSign').setOrigin(0, 0).setDisplaySize(225, 80);
            // } else {
            //     this.turnImage.destroy();
            // }
            

        });


    }
    createLocalCharacterPanel() {
        const scene = this.scene as any;
        this.add(scene.add.image(-18, 70, 'characterPanelBarBG').setOrigin(0, 0).setDisplaySize(260, 30).setTint(0x000000).setAlpha(0.5));
        this.healthBarImg = scene.add.image(-18, 70, 'characterPanelBarBG').setOrigin(0, 0).setDisplaySize(260, 30).setTint(0xff0000);
        this.add(this.healthBarImg);
        this.add(scene.add.image(-18, 70, 'characterPanelBar').setOrigin(0, 0).setDisplaySize(260, 30));

        this.add(scene.add.image(0, 0, 'mainCharFrameBG').setOrigin(0, 0).setDisplaySize(225, 80));
        this.add(scene.add.image(10, 8, 'charIcon' + this.player.client.charIndex).setOrigin(0, 0).setDisplaySize(60, 60));
        this.add(scene.add.image(0, 0, 'mainCharFrame').setOrigin(0, 0).setDisplaySize(225, 80));
        this.add(scene.rexUI.add.textBox({
            x: 0, y: 30,
            width: 120,
            align: 'left',
            text: scene.add.text(0, 0, this.player.playerName, {
                fontSize: 20,
                wordWrap: { width: 120 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily'
            }).setAlpha(0.8),
            space: {
                // For innerSizer
                innerLeft: 78, innerRight: 2, innerTop: 30, innerBottom: 2,
            }
        }).setOrigin(0,0.5).layout())
    }



    createRemoteCharacterPanel() {
        const scene = this.scene as any;
        this.add(scene.add.image(0, 70, 'mainCharFrameBG').setOrigin(0, 0).setDisplaySize(160, 50));
        this.add(scene.rexUI.add.textBox({
            x: 20, y: 82,
            width: 120,
            align: 'center',
            
            text: scene.add.text(0, 0, this.player.playerName, {
                fontSize: 18,
                wordWrap: { width: 120 },
                maxLines: 1,
                fontFamily: 'DTBodyFontFamily',
                color: '#ffffff',
            }).setAlpha(0.5),
            space: {
                // For innerSizer
                innerLeft: 2, innerRight: 2, innerTop: 30, innerBottom: 2,
            }
        }).setOrigin(0,0.5).layout())
        this.add(scene.add.image(0, 70, 'mainCharFrame').setOrigin(0, 0).setDisplaySize(160, 50));

        this.add(scene.add.image(0, 0, 'mainCharFrameBG').setOrigin(0, 0).setDisplaySize(160, 80));
        this.add(scene.add.image(10, 8, 'charIcon' + this.player.client.charIndex).setOrigin(0, 0).setDisplaySize(60, 60));
        this.add(scene.add.image(0, 0, 'mainCharFrame').setOrigin(0, 0).setDisplaySize(160, 80));

        
        
    }

    setHealth(health: number) {
        if (this.healthBarImg) {
            this.healthBarImg.setDisplaySize(260 * health / 100, 30);
        }
    }
}