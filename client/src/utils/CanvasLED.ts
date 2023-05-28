export class CanvasLED {
    public readonly h = 32;
    public readonly radii = [4];
    public w = 0;
    public x = 0;
    public y = 0;
    public fillStyle = "";

    public constructor(
        col: number,
        row: number,
        dimensionWidth: number,
        animVarCoeff: string,
        countRef: number,
        isHSL: boolean
    ) {
        this.#createXCoordAndWidth(col, dimensionWidth);
        this.#createYCoord(row);
        this.#createFillStyle(col, row, countRef, animVarCoeff, isHSL);
    }

    #createFillStyle(
        col: number,
        row: number,
        countRef: number,
        animVarCoeff: string,
        isHSL: boolean
    ): void {
        // THIS IS THE SPIRAL PATTERN! add countRef to animate!
        const num1 = row * 8 * col * Number(animVarCoeff) + countRef;

        // number that wraps around when overflowed so it can loop colors
        const uint8_1 = new Uint8Array(1).fill(num1);

        const intToHexString_1 = uint8_1[0].toString(16);

        const hslValue = parseInt(CanvasLED.createPaddedHexString(intToHexString_1), 16);

        const red = CanvasLED.createPaddedHexString((50).toString(16));
        const green = CanvasLED.createPaddedHexString(intToHexString_1);
        const blue = CanvasLED.createPaddedHexString(intToHexString_1);

        if (isHSL) {
            this.fillStyle = `hsl(${hslValue}, 100%, 50%)`;
        } else {
            this.fillStyle = `#${red}${green}${blue}`;
        }
    }

    #createYCoord(row: number): void {
        this.y = row * 30;
    }

    #createXCoordAndWidth(col: number, dimensionWidth: number): void {
        if (dimensionWidth === 1024) {
            //

            this.x = Math.abs(col * 31 + (dimensionWidth - 1024));
            this.w = dimensionWidth / 33;

            //
        } else if (dimensionWidth > 1024) {
            // move leds by column over by an X amount of window is larger than 1024 pixels
            // to fill up the whole window

            this.x = col * 31 * (dimensionWidth / 1024);
            this.w = dimensionWidth / 33;

            //
        } else if (dimensionWidth <= 1024) {
            //
            this.x = col * 31 * (dimensionWidth / 1024);

            // width offset when screen width is less than 1024
            this.w = dimensionWidth / this.w;
            //
        }
    }

    public static createPaddedHexString(hexString: string): string {
        const num = parseInt(hexString, 16);
        return num <= 16 ? `0${hexString}` : hexString;
    }
}
