const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const otpSchema = new Schema({
    key: String,
    otp:String
})

const Otp = model('otps', otpSchema)

module.exports = Otp