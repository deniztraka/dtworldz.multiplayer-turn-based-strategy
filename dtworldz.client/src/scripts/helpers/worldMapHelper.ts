const floorTileIndexes = [8, 9, 10, 11];
const forestTileIndexes = [4, 5, 6, 7];
const mountainTileIndexes = [0, 1, 2, 3];

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

        // let mapData = [];
        // for (let x = 0; x < width; x++) {
        //     let column = [];
        //     for (let y = 0; y < height; y++) {
        //         column.push(data[x * height + y].biome);
        //     }
        //     mapData.push(column);
        // }

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

        // let mapData = [];
        // for (let x = 0; x < width; x++) {
        //     let column = [];
        //     for (let y = 0; y < height; y++) {
        //         column.push(data[x * height + y].nature);
        //     }
        //     mapData.push(column);
        // }

        return mapData;
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