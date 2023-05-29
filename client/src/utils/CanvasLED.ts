export class CanvasLED {
    public readonly h = 32;
    public readonly radii = [4];
    public w = 0;
    public x = 0;
    public y = 0;
    public fillStyle = "";
    public presetName = "";

    public constructor(
        col: number,
        row: number,
        dimensionWidth: number,
        animVarCoeff: string,
        countRef: number,
        isHSL: boolean,
        presetName: string
    ) {
        this.presetName = presetName || "spiral";

        this.#setXCoordAndWidth(col, dimensionWidth);

        this.#setYCoord(row);

        // creating fill style will eventually be set by a user saved preset given certain parameters
        this.#setFillStyle(col, row, countRef, animVarCoeff, isHSL);
    }

    #setFillStyle(
        col: number,
        row: number,
        countRef: number,
        animVarCoeff: string,
        isHSL: boolean
    ): void {
        const hexString = this._determineHexStringFromPreset(row, col, animVarCoeff, countRef);

        const hslValue = parseInt(CanvasLED._createPaddedHexString(hexString), 16);

        const red = CanvasLED._createPaddedHexString((50).toString(16));
        const blue = CanvasLED._createPaddedHexString(hexString);
        const green = CanvasLED._createPaddedHexString((10).toString(16));

        if (isHSL) {
            if (this.presetName === "dm5") {
                const lightnessBasedOnRow = this._generateLightness(
                    col,
                    row,
                    animVarCoeff,
                    countRef
                );
                this.fillStyle = `hsl(100, 100%, ${lightnessBasedOnRow}%)`;
            } else {
                this.fillStyle = `hsl(${hslValue}, 100%, 50%)`;
            }
        } else {
            if (this.presetName === "dm5") {
                this.fillStyle = "hsl(100, 100%, 50%)";
            } else {
                this.fillStyle = `#${red}${green}${blue}`;
            }
        }
    }

    #setYCoord(row: number): void {
        this.y = row * 30;
    }

    #setXCoordAndWidth(col: number, dimensionWidth: number): void {
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

    private _generateLightness(
        row: number,
        col: number,
        animVarCoeff: string,
        countRef: number
    ): string {
        // animation-duration: ${led <= 3 ? 1 : led / 3.14159 / 2}s;
        // animation-delay: ${row % 5 === 0 ? led / 3.14159 : led / Number(coeff)}s;

        let num =
            ((col + 1) % 5 === 0 ? row + 1 / Math.PI : (row + 1) / Number(animVarCoeff)) *
            (countRef * 0.005);

        if (num > 50) {
            num = num % 50;
        }
        return num.toString();
    }

    public static _createPaddedHexString(hexString: string): string {
        // number that wraps around when overflowed so it can loop colors
        // rgb uses three 8 bit values - this will create a padded 0 on the left side if the number was less than 16
        const uint8 = new Uint8Array(1).fill(parseInt(hexString, 16));
        return uint8[0] <= 16 ? `0${hexString}` : hexString;
    }

    private _determineHexStringFromPreset(
        row: number,
        col: number,
        animVarCoeff: string,
        countRef: number
    ): string {
        switch (this.presetName) {
            case "spiral":
                return this._createSpiralPatternHexString(row, col, animVarCoeff, countRef);
            case "rainbowTest":
                return this._createRainbowTestPatternHexString(row, col, animVarCoeff, countRef);
            case "v2":
                return this._createV2PatternHexString(row, col, animVarCoeff, countRef);
            case "waves":
                return this._createWavesPatternHexString(row, col, animVarCoeff, countRef);
            case "dm5":
                return this._createWavesPatternHexString(row, col, animVarCoeff, countRef);
            default:
                return this._createCustomPatternHexString(row, col, animVarCoeff, countRef);
        }
    }

    // will have user set number for animvarcoeff value set in the user database.
    private _createCustomPatternHexString(
        row: number,
        col: number,
        animVarCoeff: string /** this will be variable depending on user database column values */,
        countRef: number
    ): string {
        // THIS IS THE SPIRAL PATTERN! add countRef to animate!
        const num = row * 8 * col * Number(animVarCoeff) + countRef;
        // number that wraps around when overflowed so it can loop colors
        const uint8_1 = new Uint8Array(1).fill(num);

        return uint8_1[0].toString(16);
    }

    private _createWavesPatternHexString(
        row: number,
        col: number,
        animVarCoeff: string,
        countRef: number
    ): string {
        // animation-duration: ${led / 32 + row / led}s;
        // animation-delay: ${led / 16 + led / (row / led - 2 * Number(coeff))}s;

        const num =
            countRef / (col + 1) / 16 +
            (col + 1) / ((row + 1) / (col + 1) - (countRef % 512) * (Number(animVarCoeff) * 0.1));

        const uint8 = new Uint8Array(1).fill(num - (countRef / 2) * ((row + 1) / (col + 1)));

        return uint8[0].toString(16);
    }

    private _createV2PatternHexString(
        row: number,
        col: number,
        animVarCoeff: string,
        countRef: number
    ): string {
        // animation-duration: ${led <= 3 ? led / 2 : led / 8}s;
        // animation-delay: ${led / 16 + led / (row / led - Number(coeff) / 5 / 5)}s;
        const num =
            32 / (countRef / (row + 1)) +
            (col + 1) / ((row + 1) / (col + 1) - Number(animVarCoeff) / countRef) +
            countRef * ((col + 1) * 0.05);

        const uint8 = new Uint8Array(1).fill(num);

        return uint8[0].toString(16);
    }

    private _createRainbowTestPatternHexString(
        row: number,
        col: number,
        animVarCoeff: string,
        countRef: number
    ): string {
        // original idea relating to animation start times and durations (only applies to the css styling but has some similarities)
        // animation-duration: ${Number(coeff) / 100}s;
        // led / 64 + led / (row / led) / (Number(coeff) / 20 + row / (Number(coeff) / 20))
        const num =
            col / 64 +
            col / ((row + 1) / (col + 1)) / Number(animVarCoeff) +
            countRef / Number(animVarCoeff);

        const uint8 = new Uint8Array(1).fill(num);

        return uint8[0].toString(16);
    }

    private _createSpiralPatternHexString(
        row: number,
        col: number,
        animVarCoeff: string,
        countRef: number
    ): string {
        // THIS IS THE SPIRAL PATTERN! add countRef to animate!
        const num = row * 8 * col * Number(animVarCoeff) + countRef;
        // number that wraps around when overflowed so it can loop colors
        const uint8_1 = new Uint8Array(1).fill(num);

        return uint8_1[0].toString(16);
    }
}
