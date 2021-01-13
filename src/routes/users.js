const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');

const User = require('../models/User');
const registerController = require('../controllers/registerController');

// Load User model

const { forwardAuthenticated } = require('../../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

//Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register',registerController.register);

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('user', {

    successRedirect: '/dashboard',

    failureRedirect: '/users/login',
    failureFlash: true

  })(req, res, next);
});


module.exports = router;
