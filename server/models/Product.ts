

import { prop, Ref } from "@typegoose/typegoose";
import { CategoryClass } from "./Category";

export class ProductClass {
  @prop({ required: true, trim: true })
  public name!: string;

  @prop()
  public description?: string;

  @prop()
  public image?: string;

  @prop({ required: true, min: 0.99 })
  public price!: number;

  @prop({ default: 0, min: 0 })
  public quantity?: number;

  @prop({ ref: () => CategoryClass, required: true })
  public category: Ref<CategoryClass>;
}

// const productSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String
//   },
//   image: {
//     type: String
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0.99
//   },
//   quantity: {
//     type: Number,
//     min: 0,
//     default: 0
//   },
//   category: {
//     type: Schema.Types.ObjectId,
//     ref: 'Category',
//     required: true
//   }
// });