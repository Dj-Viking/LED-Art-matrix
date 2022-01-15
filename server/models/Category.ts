import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: { collection: "categories" },
})
export class CategoryClass {
  @prop({ required: true, trim: true })
  public name!: string;
}

// const categorySchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   }
// });

// const Category = mongoose.model('Category', categorySchema);
