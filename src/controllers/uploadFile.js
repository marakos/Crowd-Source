const util = require ("util");
const multer = require ("multer");
const fs = require ("fs");
const Cordinates = require ('../models/Cordinates');
var Ajv = require('ajv');

exports.uploadJson = async (req, res) => {
    if (req.user.admin_role) {
        req.flash ('error_msg', 'User-only content');
        res.redirect ('/adminpanel');
    } else {
        try {
            const storage = multer.diskStorage ({
                destination: function (req, file, callback) {
                    callback (null, './data/');
                },
                filename: function (req, file, callback) {
                    callback (null, 'uploadedJsonFile.json');
                }
            });
            var uploadJson = multer ({storage: storage}).single ("file");
            var upload = util.promisify (uploadJson);
            await upload (req, res);
            const file = req.file;
            if (!file) {
                req.flash ('error_msg', 'Please select file to upload');
                res.redirect ('/upload')

            }else {
                fs.readFile ("C:\\Users\\user\\WebstormProjects\\web project\\data\\uploadedJsonFile.json", (err, data) => {  // READ
                    if (err) {
                        return console.error (err);
                    }

                    try {
                        var data = JSON.parse (data.toString ());

                    fs.writeFile ("C:\\Users\\user\\WebstormProjects\\web project\\data\\uploadedJsonFile.json", JSON.stringify (data), (err, result) => {  // WRITE
                        if (err) {
                            return console.error (err);
                        } else {
                            //---------- Remove unwanted locations
                            for (const property in data.locations) {
                                var givenlt = 38.230462;
                                var targetlt = data.locations[property].latitudeE7 / 10000000;
                                var givenln = 21.753150;
                                var targetln = data.locations[property].longitudeE7 / 10000000;
                                var dLat = (givenlt - targetlt) * Math.PI / 180;
                                var dLon = (givenln - targetln) * Math.PI / 180;
                                var a = 0.5 - Math.cos (dLat) / 2 + Math.cos (targetlt * Math.PI / 180) * Math.cos (givenlt * Math.PI / 180) * (1 - Math.cos (dLon)) / 2;
                                let d = Math.round (6371000 * 2 * Math.asin (Math.sqrt (a))) / 1000;
                                if (d > 10) {
                                    delete data.locations[property];
                                }
                            }
                            fs.writeFile ("C:\\Users\\user\\WebstormProjects\\web project\\data\\uploadedJsonFile.json", JSON.stringify (data, (k, v) => Array.isArray (v) ? v.filter (e => e !== null) : v), 'utf8', function (err) {
                                if (err) {
                                    console.log ("An error occured while writing JSON Object to File.");
                                    return console.log (err);
                                }
                                fs.readFile ("C:\\Users\\user\\WebstormProjects\\web project\\data\\uploadedJsonFile.json", (err, data) => {  // READ
                                    if (err) {
                                        return console.error (err);
                                    }


                                    data = JSON.parse (data.toString ());
                                    const user = [];
                                    try{
                                    for (let i = 0; i < data.locations.length; i++) {
                                        user.push (data.locations[i].latitudeE7 / 10000000, data.locations[i].longitudeE7 / 10000000)
                                    }

                                    res.render ('upload', {data: user});
                                    } catch(e) {
                                        req.flash ('error_msg', 'Please select a valid JSON');
                                        res.redirect ('/upload');
                                    }
                                });
                            });
                        }
                    });
                    } catch(e) {
                        req.flash ('error_msg', 'Please select a valid JSON');
                        res.redirect ('/upload');
                    }
                });
            }
        }

        catch
            (error)
            {
                req.flash ('error_msg', 'Something goes wrong');
                res.redirect ('/upload')

            }

    }
};
exports.uploadJsonDB = async (req, res) => {
    if (req.user.admin_role) {
        req.flash('error_msg', 'User-only content');
        res.redirect('/adminpanel');
    } else {
        const user = req.user;
        const path = "C:\\Users\\user\\WebstormProjects\\web project\\data\\uploadedJsonFile.json"
        var exists = fs.existsSync(path);
        if (!exists) {
            req.flash('error_msg', 'Please select file to upload first');
            res.redirect('/upload')

        }else {
            fs.readFile (path, (err, data) => {  // READ
                if (err) {
                    return console.error (err);
                }

                var data = JSON.parse (data.toString ());
                data.user_id = user.user_id; // MODIFY
                fs.writeFile (path, JSON.stringify (data), (err, result) => {  // WRITE
                    if (err) {
                        return console.error (err);
                    } else {
                        Cordinates.insertMany (data); // Save to DB
                        fs.unlinkSync (path);
                    }
                });
            });
            req.flash ('success_msg', 'File uploaded to DB');
            res.redirect ('/upload')
        }
    }
};
exports.uploadJsonExclude = async (req, res) => {
    if (req.user.admin_role) {
        req.flash('error_msg', 'User-only content');
        res.redirect('/adminpanel');
    } else {
        try {
            var array = req.body.passdata.split(',').map(Number);
            const path = "C:\\Users\\user\\WebstormProjects\\web project\\data\\uploadedJsonFile.json"
            var exists = fs.existsSync(path);
            if (!exists) {
                req.flash('error_msg', 'Please select file to upload first');
                res.redirect('/upload')
                return;
            }
            fs.readFile(path, (err, data) => {  // READ
                if (err) {
                    return console.error(err);
                }
                ;
                var data = JSON.parse(data.toString());
                fs.writeFile(path, JSON.stringify(data), (err, result) => {  // WRITE
                    if (err) {
                        return console.error(err);
                    } else {
                        //---------- Remove unwanted locations
                        for (const property in data.locations) {
                            var givenltne = array[0];
                            var givenlnne = array[1];
                            var givenltsw = array[2];
                            var givenlnsw = array[3];
                            var targetlt = data.locations[property].latitudeE7 / 10000000;
                            var targetln = data.locations[property].longitudeE7 / 10000000;
                            if ((targetlt < givenltne && targetlt > givenltsw) && (targetln < givenlnne && targetln > givenlnsw)) {
                                delete data.locations[property];
                            }
                        }
                        fs.writeFile(path, JSON.stringify(data, (k, v) => Array.isArray(v) ? v.filter(e => e !== null) : v), 'utf8', function (err) {
                            if (err) {
                                console.log("An error occured while writing JSON Object to File.");
                                return console.log(err);
                            }
                            fs.readFile(path, (err, data) => {  // READ
                                if (err) {
                                    return console.error(err);
                                }

                                data = JSON.parse(data.toString());
                                const user = []
                                for (let i = 0; i < data.locations.length; i++) {
                                    user.push(data.locations[i].latitudeE7 / 10000000, data.locations[i].longitudeE7 / 10000000)
                                }
                                res.render('upload', {data: user});
                            });
                        });
                    }
                });
            });

        } catch (error) {
            req.flash('error_msg', 'Something goes wrong');
            res.redirect('/upload')
        }
    }
};

