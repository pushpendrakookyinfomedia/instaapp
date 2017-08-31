const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name Field Is Required']
    },
    userEmail: {
        type: String,
        required: [true, 'Email Id Is Required']
    },
    userPassword: {
        type: String,
    },
    totalInvite: {
        type: Number,
        default: 0
    },
    profileImg: {
        type: String,
        default: ''
    },
    lastView: {
        type: Number,
        default: 0
    },
    fbKey: {
        type: String,
        default: ''
    },
    gPlusKey: {
        type: String,
        default: ''
    },
    otp: {
        type: Number,
        default: 0
    },
    isOtpVerify: {
        type: Boolean,
        default: 0

    }

});

const User = mongoose.model('user', userSchema);

module.exports = User;