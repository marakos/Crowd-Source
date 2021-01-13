const fs = require("fs");

    uploadJson = async (req, res) => {
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
                                    ;

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
                return;
            }
        }
    };
    module.exports = {
        uploadJson: uploadJson
    };
