const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

  password: {
    type: String,
    required: true
  },
  admin_role:{
      type : Boolean,
      required: false
  }

});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
