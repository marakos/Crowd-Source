const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Load Admin model
const Admin = require('../models/Admin');

exports.registerAdmin = (req, res) => {
    const {username, password, password2, admin_role} = req.body;
    let errors = [];

    if (!username || !password || !password2) {
        errors.push({msg: 'Please enter all fields'});
    }

    if (password != password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    if (password.length < 8) {
        errors.push({msg: 'Password must be at least 8 characters'});
    }

    if (errors.length > 0) {
        res.render('adminregister', {
            errors,
            username,
            password,
            password2
        });
    } else {


        Admin.findOne({username: username }).then(admin => {

                if (admin) {
                    errors.push({msg: 'Username already exists'});
                    res.render('adminregister', {
                        errors,
                        username,
                        password,
                        password2
                    });
                }

             else{
                const newAdmin = new Admin({
                    username,
                    password,
                    admin_role,
                });


                newAdmin.admin_role = true;
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                        if (err) throw err;
                        newAdmin.password = hash;
                        newAdmin
                            .save()
                            .then(admin => {


                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/admin/adminlogin');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        }

     );

    }

}

