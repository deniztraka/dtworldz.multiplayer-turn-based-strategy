

export class WorldMapHelper {
    static convertToMapData(serverMapData: any, width: number, height: number){
        let data: { index:number; x: number; y: number; }[] = Array.from(serverMapData.$items.values());

        let mapData = [];
        for (let i = 0; i < width; i++) {
            let row = [];
            for (let j = 0; j < height; j++) {
                row.push(data[i * height + j].index);
            }
            mapData.push(row);
        }
        return mapData;
    }
}