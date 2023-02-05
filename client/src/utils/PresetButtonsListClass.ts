import { IPresetButton } from "../types";
import { MY_INDEX_TO_KEY_MAP, MyIndexToKeyMap } from "../constants";
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
        this._list = dbPresets.map((preset, index: number) => {
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

    private _createDisplayName(displayName: string, presetName: string): string {
        // doing this for now since the initial presets always have the same displayName as the presetName
        // and will have an initial displayName of "" when instantiated on the server
        if (
            ["dm5", "waves", "v2", "rainbowTest", "fourSpirals", "spiral"].includes(presetName) &&
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
}

export { PresetButtonsList };
