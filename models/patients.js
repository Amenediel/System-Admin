const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    created:{
        type: Date,
        required: true,
        default: Date.now
    },
    diagnosis:{
        type: String,
        required: true,
    },
    plan:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    therapist:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
});
module.exports = mongoose.model('Patient', userSchema);