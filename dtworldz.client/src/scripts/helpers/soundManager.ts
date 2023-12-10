export class SoundManager {
    scene: any;
    constructor(scene: any) {
        this.scene = scene;

    }

    addSound(key: string, volume: number = 1, loop: boolean = false, maxDistance: number = 10000, follow: any = undefined) {
        this.scene.sound.add(key,
            {
                mute: false,
                volume: volume,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: loop,
                delay: 0,
                // source of the spatial sound
                source: {
                    x: 0,
                    y: 0,
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
                    follow: follow
                }
            });
    }
}