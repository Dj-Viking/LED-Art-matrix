import { prop } from "@typegoose/typegoose";

class PresetClass {
  @prop({ trim: true })
  public presetName: string;

  @prop({ default: "64" })
  public animVarCoeff: string;
}

// const presetSchema = new Schema({
//   presetName: {
//     type: String,
//     trim: true
//   }
// });

export { PresetClass };
