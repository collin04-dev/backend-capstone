const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const admin = require('../controllers/admin.controller');
const auth = require('../controllers/auth.controller');
const passport = require('passport');


//Route to Handle Post /addUser
router.get('/', user.userHome);
router.post('/addUser', user.addUser);
router.post('/register', admin.register, auth.login);
router.post('/login', auth.login);

router.use(auth.isAuthenticated);
router.get('/userList', user.listUsersPage)
router.get('/add', user.addUpdateUserPage);
router.post('/adminAddUser', user.adminAddUser)
router.get('/update/:_id', user.addUpdateUserPage);
router.get('/delete/:_id', user.deleteUser);
router.get('/messageUser/:_id', user.messageUser);
router.get('/messageAllUsers', user.messageAllUsers);
router.get('/logout', auth.logout);

module.exports = router;