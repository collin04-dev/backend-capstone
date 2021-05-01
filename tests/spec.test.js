const app = require('../index');
const supertest = require('supertest');
const User = require('../models/user.model');
const mongoose = require('mongoose');

beforeEach(async (done) => {
    const mongoUrl = `${process.env.MONGO_TEST}`;
    const mongoOptions = {useFindAndModify: false};
    mongoose.connect(mongoUrl, mongoOptions, () => done())
}, 20000);

afterEach(async (done) => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    done();
});

//Tests if user is added to database
test("POST /addUser", async() => {
    await supertest(app)
    .post("/addUser")
    .send({
        firstName: "Test",
        phoneNumber: "12345",
    })
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(async response => {
        expect(response.body._id).toBeTruthy();

        let users = await User.find({});
        expect(users.length).toBe(1);
    });
})