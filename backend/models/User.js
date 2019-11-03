var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, index: {unique: true} },
    password: { type: String, required: true, select: false },
    date: { type: Date, default: Date.now }
});

UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

// module.exports = mongoose.model('User', UserSchema);

const User = module.exports = mongoose.model('User', UserSchema);
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}