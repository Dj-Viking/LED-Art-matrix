import { prop, Ref, modelOptions } from "@typegoose/typegoose";
import { ProductClass } from "./Product";

@modelOptions({
  schemaOptions: { collection: "orders" },
})
export class OrderClass {
  @prop({ default: Date.now() })
  public purchaseDate?: Date;

  @prop({ ref: () => ProductClass })
  public products?: Ref<ProductClass>[];
}

// const orderSchema = new Schema({
//   purchaseDate: {
//     type: Date,
//     default: Date.now
//   },
//   products: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'Product'
//     }
//   ]
// });
