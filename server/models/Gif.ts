import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: { collection: "gifs" }
})
export class GifClass {
  @prop({ trim: true })
  public gifCategory?: string;

  @prop({ trim: true })
  public gifSrc?: string;

  @prop({ trim: true, default: "15" })
  public limit?: string;
}

// const gifSchema = new Schema({
//   gifCategory: {
//     type: String,
//     trim: true
//   },
//   gifSrc: {
//     type: String,
//     trim: true
//   },
//   limit: {
//     type: String,
//     trim: true
//   }
// });

// const Gif = mongoose.model('Gif', gifSchema); 

// module.exports = Gif;