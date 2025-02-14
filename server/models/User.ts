require("dotenv").config();
import { pre, prop, plugin, Ref, DocumentType, modelOptions } from "@typegoose/typegoose";

import bcrypt from "bcryptjs";
import { OrderClass } from "./Order";
import { PresetClass } from "./PresetClass";
import { SearchTermClass } from "./SearchTerm";
import { GifClass } from "./Gif";
import uniqueValidator from "mongoose-unique-validator";

// const PresetSchema = buildSchema(PresetClass);

@modelOptions({
    schemaOptions: { collection: "users" },
})
@pre<UserClass>("save", async function (next) {
    if (this.isNew) this.password = await bcrypt.hash(this.password, Number(process.env.SALT));
    next();
})
@plugin(uniqueValidator)
export class UserClass {
    @prop({ required: true, trim: true })
    public username!: string;

    @prop({ required: true, trim: true, unique: true })
    public email!: string;

    @prop({ required: true })
    password!: string;

    @prop()
    public token?: string;

    @prop({ ref: () => OrderClass })
    public orders?: Ref<OrderClass>[];

    @prop({ type: () => GifClass, default: [] })
    public gifs: GifClass[];

    @prop({ type: () => PresetClass, default: [] })
    public presets: PresetClass[];

    @prop()
    public defaultPreset?: PresetClass;

    @prop({ ref: () => SearchTermClass })
    public userSearchTerm?: Ref<SearchTermClass>;

    public async isCorrectPassword(this: DocumentType<UserClass>, plainPass: string) {
        return bcrypt.compare(plainPass, this.password);
    }
}

// const userSchema = new Schema({
//   username: {
//     type: String,
//     required: true,
//     trim: true,
//     unique: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 1
//   },
//   token: {
//     type: String
//   },
//   orders: [
//     Order.schema
//   ],
//   presets: [presetSchema],
//   defaultPreset: presetSchema,
//   userSearchTerm: {
//     type: Schema.Types.ObjectId,
//     ref: 'SearchTerm'
//   }
// });
