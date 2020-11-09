const mongoose = require('mongoose');
const { Schema } = mongoose;

const gifSchema = new Schema({
  gifCategory: {
    type: String,
    trim: true
  },
  gifSrc: {
    type: String,
    trim: true
  },
  limit: {
    type: String,
    trim: true
  }
});

const Gif = mongoose.model('Gif', gifSchema); 

module.exports = Gif;