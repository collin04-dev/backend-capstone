const passport = require('passport');


//Authentication MiddleWare
exports.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/');
    }
}

exports.login = passport.authenticate('local', {
    failueRedirect: '/',
    successRedirect: '/userList',
})

exports.logout = (req, res) => {
    //Built in logout method with passport
    req.logout();
    res.redirect('/');
}

