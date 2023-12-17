export class SoundManager {
    
    scene: any;
    constructor(scene: any) {
        this.scene = scene;

    }

    stop(key:string){
        this.scene.sound.stopByKey(key);
    }

    play(key: string, sourceX: number, sourceY: number, maxDistance: 10000, volume: 1) {
        if(sourceX == undefined || sourceY == undefined){
            sourceX =this.scene.scale.width/2;
            sourceY = this.scene.scale.height/2;
        }

        this.scene.sound.play(key,
            {
                mute: false,
                volume: volume,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay: 0,
                // source of the spatial sound
                source: {
                    x: sourceX,
                    y: sourceY,
                    z: 0,
                    panningModel: 'equalpower',
                    distanceModel: 'inverse',
                    orientationX: 0,
                    orientationY: 0,
                    orientationZ: -1,
                    refDistance: 1,
                    maxDistance: maxDistance,
                    rolloffFactor: 1,
                    coneInnerAngle: 360,
                    coneOuterAngle: 0,
                    coneOuterGain: 0,
                    follow: undefined
                }
            }
        );
    }

    setListenerPosition(x: any, y: any) {
        
            this.scene.sound.setListenerPosition(x, y);
        
    
    }
}