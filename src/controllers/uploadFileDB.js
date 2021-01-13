const fs = require("fs");
const Cordinates = require('../models/Cordinates');

    uploadJson = async (req, res) => {
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
                return;
            }
            fs.readFile(path, (err, data) => {  // READ
                if (err) {
                    return console.error(err);
                }
                ;
                var data = JSON.parse(data.toString());
                data.user_id = user.user_id; // MODIFY
                fs.writeFile(path, JSON.stringify(data), (err, result) => {  // WRITE
                    if (err) {
                        return console.error(err);
                    } else {
                        Cordinates.insertMany(data); // Save to DB
                        fs.unlinkSync(path);
                    }
                });
            });
            req.flash('success_msg', 'File uploaded to DB');
            res.redirect('/upload')
            return;
        }
    };
    module.exports = {
        uploadJson: uploadJson
    };
