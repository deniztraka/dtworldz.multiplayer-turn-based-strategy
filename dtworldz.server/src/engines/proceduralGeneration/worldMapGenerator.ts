import { TileFactory } from "../../factories/tileFactory";
import { Biomes } from "../../models/tilemap/tiles/Biomes";
import { Natures } from "../../models/tilemap/tiles/Natures";
import { BaseTile } from "../../schema/tilemap/tile/baseTile";
import { createNoise2D } from 'simplex-noise';

const natureIndex = [
    [Natures.Forest, Natures.Forest, Natures.Forest, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None],
    [Natures.Forest, Natures.Forest, Natures.None, Natures.None, Natures.None, Natures.None, Natures.Forest, Natures.None, Natures.None, Natures.None],
    [Natures.Forest, Natures.Forest, Natures.Forest, Natures.None, Natures.None, Natures.Mountain, Natures.None, Natures.None, Natures.None, Natures.Forest],
    [Natures.Forest, Natures.Forest, Natures.Forest, Natures.None, Natures.Mountain, Natures.Mountain, Natures.None, Natures.None, Natures.None, Natures.None],
    [Natures.None, Natures.Forest, Natures.Forest, Natures.Mountain, Natures.Mountain, Natures.Mountain, Natures.Forest, Natures.Forest, Natures.None, Natures.None],
    [Natures.Forest, Natures.Forest, Natures.Mountain, Natures.None, Natures.None, Natures.None, Natures.Forest, Natures.Forest, Natures.None, Natures.None],
    [Natures.None, Natures.Forest, Natures.Forest, Natures.None, Natures.Mountain, Natures.Forest, Natures.Forest, Natures.None, Natures.None, Natures.None],
    [Natures.Forest, Natures.Forest, Natures.Forest, Natures.None, Natures.Mountain, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None],
    [Natures.None, Natures.Forest, Natures.Forest, Natures.None, Natures.Forest, Natures.None, Natures.None, Natures.None, Natures.Mountain, Natures.Forest],
    [Natures.None, Natures.Forest, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.Forest, Natures.Forest],
];

export class WorldMapGenerator {

    data: BaseTile[][];
    width: number;
    height: number;
    availableBiomes: Biomes[];
    biomeData: number[][];
    natureData: number[][];
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = [];
        this.biomeData = new Array<Array<number>>();
        this.natureData = new Array<Array<number>>();
        this.availableBiomes = new Array<Biomes>();
        this.availableBiomes.push(Biomes.Plains);
    }

    generateBiomes() {

        // create a new 2d array with the width and height
        for (let x = 0; x < this.width; x++) {
            this.biomeData[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.biomeData[x][y] = this.availableBiomes[0]; // Only with Plains for now
            }
        }

        return this.biomeData;
    }

    generateNature() {
        const noise2D = createNoise2D();

        for (let x = 0; x < this.width; x++) {
            this.natureData[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.natureData[x][y] = noise2D(x, y);
            }
        }

        this.natureData = normalize2DValues(this.natureData);

        return this.natureData;
    }
}


function normalizeValues(values:number[]) {
    let min = Math.min(...values);
    let max = Math.max(...values);
    let range = max - min;

    return values.map(value => (value - min) / range);
}

function normalize2DValues(values:number[][]) {
    // Flatten the 2D array
    let flattened = values.flat();

    // Normalize the flattened array
    let normalized = normalizeValues(flattened);

    // Reshape back to 2D array
    let size = values.length;
    return normalized.reduce((acc, val, idx) => {
        if (idx % size === 0) acc.push([]);
        acc[acc.length - 1].push(val);
        return acc;
    }, []);
}