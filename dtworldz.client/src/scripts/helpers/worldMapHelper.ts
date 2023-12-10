const floorTileIndexes = [16, 17, 18, 19, 20, 21, 22, 23];
const forestTileIndexes = [8, 9, 10, 11, 12, 13, 14, 15];
const mountainTileIndexes = [0, 1, 2, 3, 4, 5, 6, 7];
const deerTileIndexes = [0, 1, 2, 3];

export class WorldMapHelper {
    static getBiomeLayerData(serverMapData: any, width: number, height: number) {
        let data: { id: number, biome: number, nature: number, components: any[] }[] = Array.from(serverMapData.$items.values());

        let mapData = [];
        for (let y = 0; y < height; y++) { // Iterate over rows with 'y'
            let row = [];
            for (let x = 0; x < width; x++) { // Iterate over columns with 'x'
                row.push(data[y * width + x].biome); // Access the correct element using 'y * width + x'
            }
            mapData.push(row);
        }

        return mapData;
    }

    static getNatureLayerData(serverMapData: any, width: number, height: number) {
        let data: { id: number, biome: number, nature: number, components: any[] }[] = Array.from(serverMapData.$items.values());

        let mapData = [];
        for (let y = 0; y < height; y++) { // Iterate over rows with 'y'
            let row = [];
            for (let x = 0; x < width; x++) { // Iterate over columns with 'x'
                row.push(data[y * width + x].nature); // Access the correct element using 'y * width + x'
            }
            mapData.push(row);
        }

        return mapData;
    }

    static getDeersTileIndexes() {
        return deerTileIndexes;
    }

    static getFloorTileIndexes() {
        return floorTileIndexes;
    }

    static getForestTileIndexes() {
        return forestTileIndexes;
    }

    static getMountainTileIndexes() {
        return mountainTileIndexes;
    }
}