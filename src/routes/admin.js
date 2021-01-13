const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const Admin = require('../models/Admin');
const registerAdminController = require('../controllers/registerAdminController');

// Load Admin model

const { forwardAuthenticated } = require('../../config/auth');

// Login Page
router.get('/adminlogin', forwardAuthenticated, (req, res) => res.render('adminlogin'));

//Register Page
router.get('/adminregister', forwardAuthenticated, (req, res) => res.render('adminregister'));

// Register
router.post('/adminregister',registerAdminController.registerAdmin);

// Login
router.post('/adminlogin', (req, res, next) => {
    passport.authenticate('admin', {

        successRedirect: '/adminpanel',

        failureRedirect: '/admin/adminlogin',
        failureFlash: true

    })(req, res, next);
});

module.exports = router;
