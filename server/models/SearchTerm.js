const mongoose = require('mongoose');
const { Schema } = mongoose;

const searchTermSchema = new Schema({
  termText: {
    type: String,
    trim: true
  },
  termCategory: {
    type: String,
    trim: true
  },
  limit: { 
    type: String 
  }
});

const SearchTerm = mongoose.model('SearchTerm', searchTermSchema);

module.exports = SearchTerm;