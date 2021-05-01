const User = require('../models/user.model');
const sms= require('../sms');
const fetch = require('node-fetch');


exports.addUser = async (req, res) => {
    //How to we get the form data

    if(req.body.id) {
        await User.findByIdAndUpdate(req.body.id, req.body);
    }
    else {
      const user = new User(req.body);
        await user.save();
        req.flash('info', 'Thank You for Signing Up!');

    }

    //res.send(`Added ${req.body.firstName} to the database`)
    res.redirect('/');
}

exports.adminAddUser = async (req, res) => {
    //How to we get the form data

    if(req.body.id) {
        await User.findByIdAndUpdate(req.body.id, req.body);
    }
    else {
      const user = new User(req.body);
        await user.save();

    }

    //res.send(`Added ${req.body.firstName} to the database`)
    res.redirect('/userList');
}

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params._id);
    res.redirect('/userList');
}

exports.listUsersPage = async (req, res) => {
    let mainHeader = "User List";

    let users = await User.find({}).lean();
    
    res.render('list', { header: mainHeader, users });

}

exports.addUpdateUserPage = async (req, res) => {
    //Update with Handlebars the users information
    if(req.params._id) {
        let user = await User.findById(req.params._id).lean();

        res.render('add-update', { user });
    }
    else {
        res.render('add-update');
    }

}

exports.messageUser = async (req, res) => {

    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth()+1;
    let year = currentDate.getFullYear();

    if (day < 10) {day = '0' + day};
    if (month < 10) {month = '0' + month};

    today = year + '-' + month + '-' + day;

    let user = await User.findById(req.params._id).lean();

    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${process.env.NASA_API}`)
    .then(res => res.json())
    .then( function (data) {
        let object = data;
            const count = object.element_count;
            if (count > 0) { 
            
            const name = object.near_earth_objects[`${today}`][0].name;
            const close = object.near_earth_objects[`${today}`][0].close_approach_data[0].close_approach_date;
            let size = parseFloat(object.near_earth_objects[`${today}`][0].estimated_diameter["miles"].estimated_diameter_max).toFixed(2);
            let distance = parseFloat(object.near_earth_objects[`${today}`][0].close_approach_data[0].miss_distance["miles"]).toFixed(2);
            let speed = parseFloat(object.near_earth_objects[`${today}`][0].close_approach_data[0].relative_velocity["miles_per_hour"]).toFixed(2);
            let nf = Intl.NumberFormat();
            
            sms.send({
                to: `+1${user.phoneNumber}`,
                body: `NASA: There are currently ${count} Objects Near Earth's Orbit Today! One of these objects is named ${name}. This object is about ${nf.format(distance)} miles from Earth and going at a speed of ${nf.format(speed)}mph! It has a diameter of ${size} miles wide and it will be closest to Earth on ${close}`
            })
        } else {
            sms.send({
                to: `+1${user.phoneNumber}`,
                body: `NASA: There are currently no objects near Earth today!`
            })
        }
    });
    res.redirect('/userList');
}

exports.messageAllUsers = async (req, res) => {
    let users = await User.find({}).lean();
    users.forEach(function(x) {
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth()+1;
        let year = currentDate.getFullYear();

        if (day < 10) {day = '0' + day};
        if (month < 10) {month = '0' + month};

        today = year + '-' + month + '-' + day;


        fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${process.env.NASA_API}`)
        .then(res => res.json())
        .then( function (data) {
            let object = data;
            
            const count = object.element_count;

            if (count > 0) {
                const name = object.near_earth_objects[`${today}`][0].name;
                const close = object.near_earth_objects[`${today}`][0].close_approach_data[0].close_approach_date;
                let size = parseFloat(object.near_earth_objects[`${today}`][0].estimated_diameter["miles"].estimated_diameter_max).toFixed(2);
                let distance = parseFloat(object.near_earth_objects[`${today}`][0].close_approach_data[0].miss_distance["miles"]).toFixed(2);
                let speed = parseFloat(object.near_earth_objects[`${today}`][0].close_approach_data[0].relative_velocity["miles_per_hour"]).toFixed(2);
                let nf = Intl.NumberFormat();
                sms.send({
                    to: `+1${x.phoneNumber}`,
                    body: `NASA: There are currently ${count} Objects Near Earth's Orbit Today! One of these objects is named ${name}. This object is about ${nf.format(distance)} miles from Earth and going at a speed of ${nf.format(speed)}mph! It has a diameter of ${size} miles wide and it will be closest to Earth on ${close}`
                })
            } else {
                sms.send({
                    to: `+1${x.phoneNumber}`,
                    body: `NASA: There are currently no objects near Earth today!`
                })
            }

        });
    });
    res.redirect('/userList');
}

exports.userHome = async (req, res) => {
    let flashes = req.flash('info');
    res.render('home', {flashes});
}
