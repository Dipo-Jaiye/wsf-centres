const {Schema, model} = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true

    }
});
UserSchema.plugin(passportLocalMongoose,{usernameField:"email"});

module.exports = model('User', UserSchema);
