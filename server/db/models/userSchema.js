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
    mobile_no: {
      type:String,
    },
    adhar: {
      type:String,
    },
    panCard: {
      type:String,
    },
    bankAccount: {
      type:String,
    },   
    gstNmber: {
      type:String,
    }, 
    address: {
      type: address
    }    

})

const User = model('users', userSchema)

module.exports = User