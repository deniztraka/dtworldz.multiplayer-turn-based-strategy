
import Phaser from 'phaser';
import { Anchor, Label } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { DTText } from './dtText';
import Button from 'phaser3-rex-plugins/plugins/button';
const defaultLabelOptions = {
    
    // anchor: undefined,
    // width: undefined,
    // height: undefined,

    // orientation: 0,
    // rtl: false,

    //background: undefined,

    //icon: iconGameObject,
    // iconMask: false,
    // squareFitIcon: false,
    // iconSize: undefined, iconWidth: undefined, iconHeight: undefined,

    
    // expandTextWidth: false,
    // expandTextHeight: false,

    //action: actionGameObject,
    // actionMask: false,
    // squareFitAction: false,
    // actionSize: undefined, actionWidth: undefined, actionHeight: undefined,

    align: 'center',

    // space: {
    //     left: 0,
    //     right: 0,
    //     top: 0,
    //     bottom: 0,

    //     icon: 0,
    //     iconTop: 0, iconBottom: 0, iconLeft: 0, iconRight: 0,

    //     text: 0,
    //     actionTop: 0, actionBottom: 0, actionLeft: 0, actionRight: 0,
    // },

    // name: '',
    // draggable: false,
    // sizerEvents: false,
    // enableLayer: false,
}

export class DTLabel extends Label {
    constructor(scene: any, x:number, y:number, text:string, config?: any, anchorConfig?: any) {

        let textObjConfig = {
            color: "#cccccc",
            fontSize: "18px",
            fontFamily: 'DTBodyFontFamily',
            padding: { left: 10, right: 10, top: 5, bottom: 5, },
        }

        if(config && config.fixedWidth){
            // @ts-ignore
            textObjConfig.fixedWidth = config.fixedWidth;
        }

        if(config && config.fixedHeight){
            // @ts-ignore
            textObjConfig.fixedHeight = config.fixedHeight;
        }

        const textObj = new DTText(scene, x, y, text, textObjConfig)

        let options = {
            ...defaultLabelOptions,
            // background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, {
            //     x: 10,
            //     y: 10
            // }, 0x000000).setAlpha(),
            ...config,
            x: x,
            y: y,
            text: textObj,
            
        };
        super(scene, options);
        this.scene.add.existing(this);
        
        this.layout();

        if(anchorConfig){
            new Anchor(this, anchorConfig);
        }
    }

    setText(text: string): this {
        super.setText(text);
        this.layout();
        return this;
    }

    setColor(color: string): DTLabel {
        (this.getElement('text') as any).setColor(color);
        return this;
    }
}