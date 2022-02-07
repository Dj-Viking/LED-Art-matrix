import { IPresetButton } from "../types";

export interface IDBPreset {
  _id: string;
  presetName: string;
  animVarCoeff?: string;
}

class PresetButtonsList {
  private list: IPresetButton[] = [];
  constructor(
    clickHandler: IPresetButton["clickHandler"], 
    dbPresets: IDBPreset[] | [], 
  ) {
    this.list = dbPresets.map(preset => {
      return {
        id: preset._id,
        key: Math.random() * 1000 + "kdjfkdjfkdj",
        role: "button",
        isActive: false,
        presetName: preset.presetName,
        testid: preset.presetName,
        clickHandler
      };
    });
  }

  public getList(): IPresetButton[] { return this.list; }

}

export { PresetButtonsList };