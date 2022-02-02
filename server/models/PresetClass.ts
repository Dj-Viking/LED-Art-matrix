import { prop } from "@typegoose/typegoose";

class PresetClass {
  @prop({ trim: true })
  presetName: string;

  @prop({ default: false })
  needsAuth: boolean;
}

// const presetSchema = new Schema({
//   presetName: {
//     type: String,
//     trim: true
//   }
// });

export { PresetClass };
