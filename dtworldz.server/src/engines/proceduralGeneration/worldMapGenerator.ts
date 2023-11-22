import { TileFactory } from "../../factories/tileFactory";
import { Biomes } from "../../models/tilemap/tiles/Biomes";
import { Natures } from "../../models/tilemap/tiles/Natures";
import { BaseTile } from "../../schema/tilemap/tile/baseTile";

const biomeIndex = [
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
    [Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains, Biomes.Plains],
];

const natureIndex = [
    [Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None],
    [Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None],
    [Natures.None, Natures.None, Natures.Forest, Natures.None, Natures.None, Natures.Mountain, Natures.None, Natures.None, Natures.None, Natures.Forest],
    [Natures.None, Natures.Forest, Natures.Forest, Natures.None, Natures.Mountain, Natures.Mountain, Natures.None, Natures.None, Natures.None, Natures.None],
    [Natures.None, Natures.Forest, Natures.Forest, Natures.Mountain, Natures.Mountain, Natures.Mountain, Natures.Forest, Natures.Forest, Natures.None, Natures.None],
    [Natures.None, Natures.Forest, Natures.Mountain, Natures.None, Natures.None, Natures.None, Natures.Forest, Natures.Forest, Natures.None, Natures.None],
    [Natures.None, Natures.Forest, Natures.None, Natures.None, Natures.Mountain, Natures.Forest, Natures.Forest, Natures.None, Natures.None, Natures.None],
    [Natures.Forest, Natures.Forest, Natures.Forest, Natures.None, Natures.Mountain, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None],
    [Natures.None, Natures.None, Natures.Forest, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.Mountain, Natures.Forest],
    [Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.None, Natures.Forest, Natures.Forest],
];

export class WorldMapGenerator {

    data: BaseTile[][];
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = [];
    }

    generateBiomes() {
        return biomeIndex;
    }

    generateNature() {
        return natureIndex;
    }
}