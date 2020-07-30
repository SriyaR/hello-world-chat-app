const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	username: String,
});

const roomSchema = new mongoose.Schema({
  name: String,
  users: {
	  type:[userSchema],
	  default:undefined,
  },
});

module.exports = mongoose.model("Room", roomSchema);

