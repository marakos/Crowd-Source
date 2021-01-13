const mongoose = require('mongoose');
// DB Config
const db = require('./config/keys').mongoURI;
// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: false , useUnifiedTopology: true, useCreateIndex: true}
    );
mongoose.connection.once("open", function() {
    console.log("Mongodb database success");
}).catch(err => console.log(err));
module.exports = {
    db_connection: mongoose.connection
};
