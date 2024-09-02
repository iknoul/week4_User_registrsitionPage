const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const address = new Schema({
  city: String,
  district: String,
  state: String,
  postalDetails: String
})

const userSchema = new Schema({
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true // Ensure email is unique
    },
    mobile_number: {
      type:String,
    },
    aadhar: {
      type:String,
    },
    pancard: {
      type:String,
    },
    bankAccountNo: {
      type:String,
    },
    bankIfscCode: {
      type:String,
    },
    gstNumber: {
      type:String,
    }, 
    pincode: {
      type: String,
    },
    dob: {
      type:Date
    }

})

const User = model('users', userSchema)

module.exports = User