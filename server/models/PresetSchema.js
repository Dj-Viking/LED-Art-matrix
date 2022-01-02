const mongoose = require('mongoose');
const {Schema} = mongoose;

const presetSchema = new Schema({
  presetName: {
    type: String,
    trim: true
  }
});

module.exports = { presetSchema };