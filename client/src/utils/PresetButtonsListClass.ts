import { IPresetButton } from "../types";

export interface IDBPreset {
  _id: string;
  presetName: string;
  displayName: string;
  animVarCoeff: string;
}

class PresetButtonsList {
  private list: IPresetButton[] = [];
  constructor(
    clickHandler: IPresetButton["clickHandler"], 
    dbPresets: IDBPreset[] | [],
    activeId?: string
  ) {
    this.list = dbPresets.map(preset => {
      return {
        id: preset._id,
        key: preset._id,
        role: "button",
        isActive: this.determineActiveOnRender(preset._id, activeId),
        animVarCoeff: preset.animVarCoeff,
        presetName: preset.presetName,
        displayName: this.createDisplayName(preset.displayName, preset.presetName),
        testid: this.createDisplayName(preset.displayName, preset.presetName),
        clickHandler
      };
    });
  }

  public getList(): IPresetButton[] { 
    return this.list; 
  }

  private createDisplayName(displayName: string, presetName: string): string {
    // doing this for now since the initial presets always have the same displayName as the presetName
    // and will have an initial displayName of "" when instantiated on the server
    if (["dm5", "waves", "v2", "rainbowTest", "fourSpirals", "spiral"].includes(presetName) && displayName === "") {
      return presetName;
    }
    return displayName;
  }

  private determineActiveOnRender(presetId: string, propsId?: string): boolean {
    if (propsId) {
      if (presetId === propsId) {
        return true;
      }
    }
    return false;
  }

}

export { PresetButtonsList };