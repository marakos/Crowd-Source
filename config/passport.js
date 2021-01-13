const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../src/models/User');
const Admin = require('../src/models/Admin');

function SessionConstructor(userId,userGroup) {
    this.userId = userId;
    this.userGroup=userGroup; // Collection Selection (User or Admin)
}
module.exports = function(passport) {
  passport.use('user', new LocalStrategy({ usernameField: 'username' },(username, password, done) =>{

        // Match user
        User.findOne({
          username: username
        }).then(user => {
          if (!user) {
            return done(null, false, {message: 'That username is not registered'});
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {message: 'Password incorrect'});
            }
          });
        });
      })
  );
  passport.use('admin', new LocalStrategy({ usernameField: 'username' },(username, password, done) =>{
        // Match user
        Admin.findOne({
          username: username
        }).then(admin => {
          if (!admin) {
            return done(null, false, {message: 'That username is not registered'});
          }

          // Match password
          bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, admin);
            } else {
              return done(null, false, {message: 'Password incorrect'});
            }
          });
        });
      })
  );


    passport.serializeUser(function (userObject, done) {
        let userGroup;
        let userPrototype =  Object.getPrototypeOf(userObject);

        if (userPrototype === User.prototype) {
            userGroup = "user";
        } else if (userPrototype === Admin.prototype) {
            userGroup = "admin";
        }

        let sessionConstructor = new SessionConstructor(userObject.id,userGroup);
        done(null,sessionConstructor);

    });

    passport.deserializeUser(function (sessionConstructor, done) {

    if (sessionConstructor.userGroup === 'user') {
        User.findOne({_id: sessionConstructor.userId}, function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
            done(err, user);

        });
    } else if (sessionConstructor.userGroup === 'admin') {
        Admin.findOne({_id: sessionConstructor.userId}, function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
            done(err, user);
        });
    }

});
};
