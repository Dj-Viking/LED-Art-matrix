import { IPresetButton } from "../types";

export interface IDBPreset {
  _id: string;
  presetName: string;
  needsAuth: boolean;
}

class PresetButtonsList {
  private list: IPresetButton[] = [];
  constructor(
    clickHandler: IPresetButton["clickHandler"], 
    dbPresets: IDBPreset[] | [],
    loggedIn: boolean,
  ) {
    this.list = dbPresets.map(preset => {
      return {
        id: preset._id,
        key: Math.random() * 1000 + "kdjfkdjfkdj",
        role: "button",
        isActive: false,
        needsAuth: preset.needsAuth,
        presetName: preset.presetName,
        testid: preset.presetName,
        disabled: !loggedIn,
        clickHandler
      };
    });
    // init the classList after we have the isActive initialized false
    this.list = this.list.map((button: IPresetButton) => {
    return {
        ...button,
        classList: ((isActive: boolean, loggedIn: boolean): string => {
          let classList = [];
          if (isActive) 
            classList.push("preset-button-active");
          else 
            classList.push("preset-button-inactive");
          if (loggedIn && button.needsAuth) 
            classList.push("preset-button");
          else 
            classList.push("preset-button-disabled");
          return classList.join(" ");
        })(button.isActive, loggedIn)
      };
    });
  }

  public getList(): IPresetButton[] { return this.list; }

}


export { PresetButtonsList };