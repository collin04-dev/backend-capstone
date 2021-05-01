const mongoose = require('mongoose');
const passportLocalMongoose = require ('passport-local-mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

adminSchema.plugin(passportLocalMongoose, { usernameField: 'email'});

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;