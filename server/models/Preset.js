const mongoose = require('mongoose');
const {Schema} = mongoose;

const presetSchema = new Schema({
  presetName: {
    type: String,
    trim: true
  }
});

const Preset = mongoose.model('Preset', presetSchema);

module.exports = Preset;