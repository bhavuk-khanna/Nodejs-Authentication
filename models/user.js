const mongoose = require('mongoose');
const path = require('path');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

// userSchema.pre('save', function(next) {
//     if (this.password) {
//         this.salt = new Buffer(
//           crypto.randomBytes(16).toString('base64'), 
//           'base64'
//         );
//         this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
        
//     };
//     next();
// });

const User = mongoose.model('User',userSchema);
module.exports = User;