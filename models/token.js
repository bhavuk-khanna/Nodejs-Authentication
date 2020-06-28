const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    //token belons to a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isValid: {
        type: Boolean,
        requied: true
    }
    
},{
    timestamps: true
});


const Token = mongoose.model('Token',tokenSchema);
module.exports = Token;