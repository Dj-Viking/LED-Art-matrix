import { prop, plugin, modelOptions, Severity, mongoose, Ref } from "@typegoose/typegoose";
import { UserClass } from "./User";
import mongooseUniqueValidator from "mongoose-unique-validator";

@modelOptions({
    schemaOptions: { collection: "gifs" },
})
@plugin(mongooseUniqueValidator)
export class GifClass {
    @prop({ ref: () => UserClass })
    public listOwner: Ref<UserClass>;

    @prop({ trim: true, required: true, unique: true })
    public listName: string;

    @prop({ required: true, allowMixed: Severity.ALLOW, type: mongoose.Schema.Types.Mixed })
    public gifSrcs: string[];
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
