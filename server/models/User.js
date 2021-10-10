require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const Order = require('./Order');
const Preset = require('./Preset'); 

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1
  },
  orders: [
    Order.schema
  ],
  presets: [
    Preset.schema
  ],
  defaultPreset: {
    type: Schema.Types.ObjectId,
    ref: 'Preset'
  },
  userSearchTerm: {
    type: Schema.Types.ObjectId,
    ref: 'SearchTerm'
  }
});

userSchema.virtual('pass')
    // set methods
    .set(function (password) {
        this._password = password;
    });

/**
 * set up pre-save middleware to create password
 * 
 * context of this set in the scope of this async anonymous function
 * 
 * in this case the function can be treated like an object using 'this'
 * 
 * you add properties to the returned shape of 'this'
 * @params {String} action to preform on schema
 * @params {Function} function to execute the saving of the password returned by the logged in user's query 
 * 
 * this function is called after it is defined to save the password to the 'this of type User' context generated in the context of this function
 */
// eslint-disable-next-line
let user_schema_presave_middleware_info;
userSchema.pre('save', async function(next) {
  //checking if isNew property is a truthy value, 
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(process.env.SALT));
  }

  next();
});

// userSchema.methods.updatePassword = async function(password) {
//   const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
//   console.log("what is this", this);
//   this.password = hashedPassword;
//   console.log("new this", Date.now(), this);
// }

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;