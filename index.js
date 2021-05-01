require('dotenv').config()
const express = require('express');
const routes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const Admin = require('./models/admin.model');
const flash = require('connect-flash');




passport.use(Admin.createStrategy());

passport.serializeUser((admin, done) => {
    done(null, admin._id);
});

passport.deserializeUser(async (id, done) => {
    const admin = await Admin.findById(id, "name email _id");
    done(null, admin);
});

const app = express();

app.use(session(
    {
        secret: 'can-be-anything'
    }
));

app.use(flash());

//Boilerplate Must be used in passport apps
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.urlencoded());
app.use(express.json());
app.use(routes);


module.exports = app;
