import { prop } from "@typegoose/typegoose";

class PresetClass {
  @prop({ trim: true })
  presetName: string;
}

// const presetSchema = new Schema({
//   presetName: {
//     type: String,
//     trim: true
//   }
// });

export { PresetClass };
