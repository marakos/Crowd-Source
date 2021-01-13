const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Load User model
const User = require('../models/User');

exports.register = (req, res) => {
    const {username, firstName, lastName, email, password, password2, user_id, user_role} = req.body;
    let errors = [];

    if (!username || !lastName || !firstName || !email || !password || !password2) {
        errors.push({msg: 'Please enter all fields'});
    }

    if (password != password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    if (password.length < 8) {
        errors.push({msg: 'Password must be at least 8 characters'});
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            firstName,
            lastName,
            email,
            password,
            password2
        });
    } else {


        User.findOne({username: username }).then(user => {

                if (user) {
                    errors.push({msg: 'Username already exists'});
                    res.render('register', {
                        errors,
                        username,
                        firstName,
                        lastName,
                        email,
                        password,
                        password2
                    });
                }


        User.findOne({email: email}).then(mail => {
            if (mail && !user) {

                errors.push({msg: 'Email already exists'});

                res.render('register', {
                    errors,
                    username,
                    firstName,
                    lastName,
                    email,
                    password,
                    password2
                });
            } else if(!user){
                const newUser = new User({
                    username,
                    firstName,
                    lastName,
                    email,
                    password,
                    user_role,
                    user_id,
                });
                var cipher = crypto.createCipher('aes-256-cbc',password)
                var crypted = cipher.update(email,'utf8','hex')
                crypted += cipher.final('hex');

                newUser.user_id= crypted;
                newUser.user_role = true;
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {


                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        }

     );
        }
        );
    }

};

