const Admin = require('../models/admin.model');

exports.register = async (req, res, next) => {
    const admin = new Admin({email: req.body.email});
    await Admin.register(admin, req.body.password);

    next();
}