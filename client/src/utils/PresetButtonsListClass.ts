import { IPresetButton } from "../types";
import { MY_INDEX_TO_KEY_MAP, MyIndexToKeyMap } from "../constants";
import { LedStyleEngine } from "./LedStyleEngineClass";
import { ledActions } from "../store/ledSlice";
import { keyGen } from "./keyGen";

export interface IDBPreset {
    _id: string;
    presetName: string;
    displayName: string;
    animVarCoeff: string;
}

class PresetButtonsList {
    private _list: IPresetButton[] = [];
    constructor(
        clickHandler: IPresetButton["clickHandler"],
        dbPresets: IDBPreset[] | [],
        activeId?: string
    ) {
        this._list = dbPresets?.map((preset, index: number) => {
            return {
                id: preset._id,
                key: preset._id,
                role: "button",
                keyBinding: this.createKeyBinding(index),
                isActive: this._determineActiveOnRender(preset._id, activeId),
                animVarCoeff: preset.animVarCoeff,
                presetName: preset.presetName,
                displayName: this._createDisplayName(preset.displayName, preset.presetName),
                testid: this._createDisplayName(preset.displayName, preset.presetName),
                clickHandler,
            };
        });
    }

    public getList(): IPresetButton[] {
        return this._list;
    }

    public static setStyle(
        dispatchcb: React.Dispatch<any>,
        preset: string,
        animVarCoeff: string
    ): void {
        const styleHTML = new LedStyleEngine(preset).createStyleSheet(animVarCoeff);
        dispatchcb(ledActions.setAnimVarCoeff(animVarCoeff));
        dispatchcb(ledActions.setPresetName(preset));
        dispatchcb(ledActions.setLedStyle(styleHTML));
    }

    private _createDisplayName(displayName: string, presetName: string): string {
        // doing this for now since the initial presets always have the same displayName as the presetName
        // and will have an initial displayName of "" when instantiated on the server
        if (
            ["dm5", "waves", "v2", "rainbowTest", "spiral"].includes(presetName) &&
            displayName === ""
        ) {
            return presetName;
        }
        return displayName;
    }

    private _determineActiveOnRender(presetId: string, activeId?: string): boolean {
        if (activeId) {
            if (presetId === activeId) {
                return true;
            }
        }
        return false;
    }

    private createKeyBinding(index: number): string {
        return MY_INDEX_TO_KEY_MAP[(index + 1) as keyof MyIndexToKeyMap];
    }

    public static generateOfflinePresets(): IPresetButton[] {
        const presetNames = ["rainbowTest", "v2", "waves", "spiral", "dm5"];

        const tempPresets = presetNames.map((name) => {
            return {
                _id: keyGen(),
                presetName: name,
                displayName: name,
                animVarCoeff: "1",
            } as IDBPreset;
        });

        const buttons = new PresetButtonsList((event: any) => {
            event.preventDefault();
        }, tempPresets).getList() as IPresetButton[];

        return buttons;
    }
}

export { PresetButtonsList };
