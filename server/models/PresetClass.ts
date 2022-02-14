import { prop } from "@typegoose/typegoose";

class PresetClass {
  public _id: string;

  @prop({ trim: true })
  public presetName: string;

  @prop({ trim: true, default: "" })
  public displayName: string;

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
