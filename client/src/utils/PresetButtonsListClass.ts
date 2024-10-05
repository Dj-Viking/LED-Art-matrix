/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AnalyserPresetName, IPresetButton } from "../types";
import { MY_INDEX_TO_KEY_MAP, MyIndexToKeyMap } from "../constants";
import { ledActions } from "../store/ledSlice";
import { keyGen } from "./keyGen";
import { ToolkitDispatch } from "../store/store";
import { audioActions } from "../store/audioSlice";
import { presetButtonsListActions } from "../store/presetButtonListSlice";

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
        activeId?: string,
        analyserPresetName?: AnalyserPresetName
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
                analyserPresetName: !analyserPresetName ? preset.presetName : analyserPresetName,
                displayName: this._createDisplayName(preset.displayName, preset.presetName),
                testid: this._createDisplayName(preset.displayName, preset.presetName),
                clickHandler: clickHandler,
            };
        }) as any[];
    }

    public getList(): IPresetButton[] {
        return this._list;
    }

    public static setStyle(dispatchcb: ToolkitDispatch, preset: IPresetButton, isAudio = false, analyserPresetName?: AnalyserPresetName): void {
        if (!isAudio) {
            dispatchcb(ledActions.setAnimVarCoeff(preset.animVarCoeff));
            dispatchcb(ledActions.setPresetName(preset.presetName));
            dispatchcb(
                presetButtonsListActions.checkPresetButtonsActive({
                    id: preset.id,
                })
            );
        } else {
            dispatchcb(
                presetButtonsListActions.checkPresetButtonsActive({
                    id: preset.id,
                })
            );
            dispatchcb(audioActions.setPresetname(analyserPresetName!));
        }
    }

    private _createDisplayName(displayName: string, presetName: string): string {
        // doing this for now since the initial presets always have the same displayName as the presetName
        // and will have an initial displayName of "" when instantiated on the server
        if (["dm5", "waves", "v2", "rainbowTest", "spiral", 
            "withXmul" as AnalyserPresetName,
            "withoutXmul" as AnalyserPresetName,
        ].includes(presetName) 
            && displayName === ""
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
        const presetNames = ["rainbowTest", "v2", "waves", "spiral", "dm5", 
            "withXmul" as AnalyserPresetName,
            "withoutXmul" as AnalyserPresetName,
        ];

        const tempPresets = presetNames.map((name) => {
            return {
                _id: keyGen(),
                presetName: name,
                displayName: name,
                // TODO: add to idb preset the analyserpresetname field
                animVarCoeff: "1",
            } as IDBPreset;
        });

        const buttons = new PresetButtonsList((event: any) => {
            event.preventDefault();
            console.log("BUTTON CALLBACK in the generate offline presets static method");
        }, tempPresets).getList() as IPresetButton[];

        return buttons;
    }
}

export { PresetButtonsList };
