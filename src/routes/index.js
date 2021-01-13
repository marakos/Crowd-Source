const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../../config/auth');
const connection = require('../../db').db_connection;
const ecoActivity = require('../controllers/ecoActivity');
const singleUserStats = require('../controllers/singleUserStats');
const adminStats = require('../controllers/adminStats');
const adminMap = require('../controllers/adminMap');
const fs = require("fs");
const uploadFile = require('../controllers/uploadFile');


//--Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

//----------USER-------------
//--Dashboard
router.get('/dashboard', ensureAuthenticated, function(req, res) {
        if (req.user.admin_role) {
            req.flash('error_msg', 'User-only content');
            res.redirect('/adminpanel');
        } else {
            res.render('dashboard', {
                user: req.user
            });
        }
    }
);
router.get('/ecoActivity', ensureAuthenticated, ecoActivity.activity);
//--User Stats
router.get('/userstats', ensureAuthenticated, function(req, res) {
        if (req.user.admin_role) {
            req.flash('error_msg', 'User-only content');
            res.redirect('/adminpanel');
        } else {
            res.render('userstats', {
                user: req.user
            });
        }
    }
);
router.post('/singleUserStats', ensureAuthenticated, singleUserStats.stats);
//--Data
router.get('/upload', ensureAuthenticated, function(req, res) {
        if (req.user.admin_role) {
            req.flash('error_msg', 'User-only content');
            res.redirect('/adminpanel');
        } else {
            if(fs.existsSync("C:\\Users\\user\\WebstormProjects\\web project\\data\\uploadedJsonFile.json")) {
                fs.unlinkSync("C:\\Users\\user\\WebstormProjects\\web project\\data\\uploadedJsonFile.json");
            }
            res.render('upload',{
                data:req.data
            });
        }
    }
);
router.post('/uploadFile', uploadFile.uploadJson);
router.post('/uploadFileExclude', uploadFile.uploadJsonExclude);
router.post('/uploadFileDB', uploadFile.uploadJsonDB);
//---------ADMIN----------
//--Admin Dashboard
router.get('/adminpanel', ensureAuthenticated, function(req, res) {
if (req.user.user_role) {
    req.flash('error_msg', 'Admin-only content');
    res.redirect('/dashboard');
    }
    else{
         res.render('adminpanel', {
            user: req.user,
        });
        }
    }
);
router.get('/adminStats', ensureAuthenticated, adminStats.stats);

//--Admin Maps
router.get('/adminmaps', ensureAuthenticated, function(req, res) {
        if (req.user.user_role) {
            req.flash('error_msg', 'Admin-only content');
            res.redirect('/dashboard');
        }
        else{
            res.render('adminmaps', {
                user: req.user
            });
        }
    }
);
router.get('/adminMap', ensureAuthenticated, adminMap.activities);
router.post('/adminMap', ensureAuthenticated, adminMap.heatmap);
router.post('/adminMapExport', ensureAuthenticated, adminMap.export);


//--Admin DB
router.get('/admindb', ensureAuthenticated, function(req, res) {
        if (req.user.user_role) {
            req.flash('error_msg', 'Admin-only content');
            res.redirect('/dashboard');
        }
        else{
            res.render('admindb', {
                user: req.user
            });
        }
    }
);
router.post('/admindb', ensureAuthenticated, function(req, res) {
        if (req.user.user_role) {
            req.flash('error_msg', 'Admin-only content');
            res.redirect('/dashboard');
        }
        else{
            connection.db.listCollections({name: 'cordinates'})
                .next(function(err, collinfo) {
                    if (collinfo) {
                        connection.collections['cordinates'].drop();
                        req.flash('success_msg', 'Data Deleted');
                        res.redirect('/adminpanel');
                    }else{
                        req.flash('error_msg', 'DB does not exist!');
                        res.redirect('/admindb');
                    }
                });

        }
    }
);

//----------------------
// Logout

router.get('/logout',ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;
