
import Phaser from 'phaser';
import { DTLabel } from './dtLabel';
import TextStyles from './textStyles';
import { DTTextInput } from './dtTextInput';


export class DTDialog {
    dialog: any;
    constructor(scene: any, x: number, y: number) {
        let backgroundGameObject = scene.add.rectangle(0, -10, 400, 300, 0xcccccc);
        let titleGameObject = scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, -140, 400, 40, 1, 0x333333),
            text: scene.add.text(0, -140, 'Join a lobby', {
                fontSize: '24px'
            }).setOrigin(0.5, 0.5),
            space: {
                left: 15,
                right: 15,
                top: 10,
                bottom: 10
            }
        })
        scene.add.existing(titleGameObject);

        let container = scene.add.container(0, 0);

        let explanation = scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, -140, 400, 40, 1, 0x333333),
            text: scene.add.text(0, -10, 'Enter the id of the room you want to join', {
                fontSize: '24px',
                wordWrap: { width: 300 }
            }).setOrigin(0.5, 0.5),
            space: {
                left: 15,
                right: 15,
                top: 10,
                bottom: 10
            }
        })

        let textInput = new DTTextInput(scene, 0, 0, "enter room id").setStyle(TextStyles.H5)
            .setColor("#333333")
            .setBackgroundColor("#999999");


        container.add(textInput);
        container.add(explanation);



        this.dialog = (scene as any).rexUI.add.dialog({
            // x: x,
            // y: y,
            // anchor: undefined,
            width: 600,
            height: 200,

            // Elements
            background: backgroundGameObject,

            title: titleGameObject,

            // toolbarBackground: toolbarBackgroundGameObject,
            // toolbar: [
            //     buttonGameObject,
            //     buttonGameObject,
            //     // ...
            // ],

            // leftToolbarBackground: leftToolbarBackgroundGameObject,
            // leftToolbar: [
            //     buttonGameObject,
            //     buttonGameObject,
            //     // ...
            // ],

            content: container,

            // description: descriptionGameObject,

            // choicesType: '',
            // // choicesWidth: undefined,
            // // choicesHeight: undefined,  // Used when choicesType is `'grid'`, `'grid-radio'`, or `'grid-checkboxes'`
            // choicesBackground: choicesBackgroundGameObject,
            // choices: [
            //     buttonGameObject,
            //     buttonGameObject,
            //     // ...
            // ],

            // actionsBackground: actionsBackgroundGameObject,
            // actions: [
            //     buttonGameObject,
            //     buttonGameObject,
            //     // ...
            // ],

            // Space
            space: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,

                title: 0,
                titleLeft: 0,
                titleRight: 0,
                titleTop: 0,

                toolbarItem: 0,
                leftToolbarItem: 0,

                content: 0,
                contentLeft: 0,
                contentRight: 0,

                description: 0,
                descriptionLeft: 0,
                descriptionRight: 0,

                choices: 0,
                choicesLeft: 0,
                choicesRight: 0,

                // choiceLine: 0,   // Used when choicesType is `'wrap'`, `'wrap-radio'`, or `'wrap-checkboxes'`
                // choiceColumn: 0, // Used when choicesType is `'grid'`, `'grid-radio'`, or `'grid-checkboxes'`
                // choiceRow: 0,    // Used when choicesType is `'grid'`, `'grid-radio'`, or `'grid-checkboxes'`
                choicesBackgroundLeft: 0,
                choicesBackgroundRight: 0,
                choicesBackgroundTop: 0,
                choicesBackgroundBottom: 0,

                action: 0,
                actionsLeft: 0,
                actionsRight: 0,
                actionsBottom: 0,

            },

            proportion: {
                title: 0,
                content: 0,
                description: 0,
                choices: 0,
                actions: 0,
            },

            expand: {
                title: true,
                content: true,
                description: true,
                choices: true,
                actions: false,
            },

            align: {
                title: 'center',
                content: 'center',
                description: 'center',
                choices: 'center',
                actions: 'right',
            },

            click: {
                mode: 'pointerup',
                clickInterval: 100
            }

            // name: '',
            // draggable: false,
            // sizerEvents: false,
            // enableLayer: false,
        }).on('button.over', function (button: { getElement: (arg0: string) => { (): any; new(): any; setStrokeStyle: { (arg0: number, arg1: number): void; new(): any; }; }; }, groupName: any, index: any, pointer: any, event: any) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
            .on('button.out', function (button: { getElement: (arg0: string) => { (): any; new(): any; setStrokeStyle: { (): void; new(): any; }; }; }, groupName: any, index: any, pointer: any, event: any) {
                button.getElement('background').setStrokeStyle();
            });
        this.dialog.setPosition(x, y)
        //dialog.layout()

        //scene.add.existing(this.dialog);
    }

    addToScene(scene: Phaser.Scene) {
        scene.add.existing(this.dialog);
    }

    // Add any additional methods or properties specific to the TextField class here
}