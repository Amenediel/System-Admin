const mongoose = require('mongoose');
const therapistSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    patients:{
        type: Number,
        required: true
    },
    rating:{
        type: Number,
        required: false,
    },
    salary:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    document:{
        type: String,
        required: true,
    },
    created:{
        type: Date,
        required: true,
        default: Date.now
    }
});
module.exports = mongoose.model('Therapist', therapistSchema);