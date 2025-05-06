const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportlocalmongoose = require("passport-local-mongoose");

const user = new Schema({
  email: {
    type: String,
    required: true,
  },
});

user.plugin(passportlocalmongoose);
module.exports = mongoose.model("user", user);
