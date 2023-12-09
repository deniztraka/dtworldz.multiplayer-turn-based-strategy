import Anchor from "phaser3-rex-plugins/plugins/anchor";
import { LobbyScene } from "../../scenes/LobbyScene";

export class LobbyCharacterDetailsPanel {
    
    rex: any;
    scene: LobbyScene;
    character: {
        title: string; description: string; image: string; stats: {
            str: number; dex: number; int: number;
        };
    };
    title: any;
    description: any;
    characterImage: any;
    panel: any;
    statsText: Phaser.GameObjects.Text;
    constructor(scene:LobbyScene, character: { title: string; description: string; image:string, stats: { str: number; dex: number; int: number; }}) {
        this.scene = scene;
        this.rex = (scene as any).rexUI;
        this.character = character;
        this.createPanel();
        
    }
    createPanel() {
        this.panel = this.rex.add.fixWidthSizer({
            x: 0, y: 0,
            width: 640, height: 300,
            orientation: 'x',
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                item: 8,
                line: 8,
            },
            rtl: false,
            align: 'left'
        }).addBackground(this.rex.add.roundRectangle(0, 0, 2, 2, 10, 0x000000).setAlpha(0.75).setStrokeStyle(2, 0x000000));

        let leftPanel = this.rex.add.fixWidthSizer({
            x: 0, y: 0,
            width: 140, height: 300,
            orientation: 'x',
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                item: 8,
                line: 8,
            },
            rtl: false,
            align: 'left'
        }).addBackground(this.rex.add.roundRectangle(0, 0, 2, 2, 10, 0x00ff00).setAlpha(0).setStrokeStyle(2, 0x000000));

        let rightPanel = this.rex.add.fixWidthSizer({
            x: 0, y: 0,
            width: 470, height: 300,
            orientation: 'y',
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                item: 8,
                line: 8,
            },
            rtl: false,
            align: 'left'
        }).addBackground(this.rex.add.roundRectangle(0, 0, 2, 2, 10, 0xff0000).setAlpha(0).setStrokeStyle(2, 0x000000));

        let rightPanelBottom = this.rex.add.fixWidthSizer({
            x: 0, y: 0,
            width: 450, height: 50,
            orientation: 'x',
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                item: 8,
                line: 8,
            },
            rtl: false,
            align: 'left'
        }).addBackground(this.rex.add.roundRectangle(0, 0, 2, 2, 10, 0x0000ff).setAlpha(0).setStrokeStyle(2, 0x000000));

        this.title = this.scene.add.text(0, 0, this.character.title, {
            fontFamily: 'DTSubTitleFontFamily',
            fontSize: '28px',
            color: '#fcffd2',
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }
        }).setOrigin(0.5, 0.5);

        this.description = this.rex.add.label({
            orientation: 1,
            text: this.scene.add.text(0, 0, this.character.description, {
                wordWrap: {
                    width: 400,
                },
                fontFamily: 'DTBodyFontFamily',
                fontSize: '20px',
                color: '#dddddd',
            }),
            space: { left: 20, right: 20, top: 20, bottom: 20, icon: 10, }
        });

        this.characterImage = this.scene.add.image(0, 0, this.character.image).setOrigin(0.5, 0.5).setScale(1).setAlpha(1);
        this.statsText = this.scene.add.text(0, 0, `STR: ${this.character.stats.str} | DEX: ${this.character.stats.dex} | INT: ${this.character.stats.int}`, {
            fontFamily: 'DTBodyFontFamily',
            fontSize: '20px',
            color: '#999999',
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }
        }).setOrigin(0.5, 0.5);

        this.panel.add(leftPanel);
        this.panel.add(rightPanel);

        leftPanel.add(this.characterImage);
        rightPanelBottom.add(this.statsText);

        rightPanel.add(this.title);
        rightPanel.add(this.description);
        rightPanel.add(rightPanelBottom);
        rightPanel.layout();
        leftPanel.layout();

        this.panel.setOrigin(0.5, 1)
        this.panel.layout();
        const currentPlayerDetailsContainer = this.scene.add.container(0, 0, [this.panel]);
        let anchorDetails = new Anchor(currentPlayerDetailsContainer, {
            centerX: 'center',
            bottom: '90%',
        }).anchor();
    }

    setCharacter(character: { title: string; description: string; image: string; stats: { str: number; dex: number; int: number; }; }) {
        this.character = character;
        this.title.setText(this.character.title);
        this.description.getElement('text').setText(this.character.description);
        this.characterImage.setTexture(this.character.image);
        this.statsText.setText(`STR: ${this.character.stats.str} | DEX: ${this.character.stats.dex} | INT: ${this.character.stats.int}`);
        this.panel.layout();
    }
}