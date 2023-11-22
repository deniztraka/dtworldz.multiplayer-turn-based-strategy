const floorTileIndexes = [8, 9, 10, 11];
const forestTileIndexes = [4, 5, 6, 7];
const mountainTileIndexes = [0, 1, 2, 3];

export class WorldMapHelper {
    static getBiomeLayerData(serverMapData: any, width: number, height: number){
        let data: {id:number, biome:number, nature:number, components: any[]}[]  = Array.from(serverMapData.$items.values());

        // console.log(data);

        let mapData = [];
        for (let i = 0; i < width; i++) {
            let row = [];
            for (let j = 0; j < height; j++) {
                row.push(data[i * height + j].biome);
            }
            mapData.push(row);
        }
        return mapData;
    }

    static getNatureLayerData(serverMapData: any, width: number, height: number){
        let data: {id:number, biome:number, nature:number, components: any[]}[]  = Array.from(serverMapData.$items.values());

        // console.log(data);

        let mapData = [];
        for (let i = 0; i < width; i++) {
            let row = [];
            for (let j = 0; j < height; j++) {
                row.push(data[i * height + j].nature);
            }
            mapData.push(row);
        }
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