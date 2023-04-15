import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: { collection: "searchTerms" },
})
export class SearchTermClass {
    @prop({ trim: true })
    public termText?: string;

    @prop({ trim: true })
    termCategory?: string;

    @prop({ default: "15" })
    public limit?: string;
}

// const searchTermSchema = new Schema({
//   termText: {
//     type: String,
//     trim: true
//   },
//   termCategory: {
//     type: String,
//     trim: true
//   },
//   limit: {
//     type: String
//   }
// });

// const SearchTerm = mongoose.model('SearchTerm', searchTermSchema);

// module.exports = SearchTerm;
