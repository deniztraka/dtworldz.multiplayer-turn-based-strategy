export class MathUtils {
    static getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    static getDistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
        let a = x1 - x2;
        let b = y1 - y2;
        return Math.sqrt(a * a + b * b);
    }
}