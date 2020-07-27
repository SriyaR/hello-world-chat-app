const mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
	mid: String,
});
var userSchema = new mongoose.Schema({
	username: String,
});

const roomSchema = new mongoose.Schema({
  name: String,
  users: {
	  type:[userSchema],
	  default:undefined,
  },
  messages: {
	  type:[messageSchema],
	  default:undefined,
  },
});

module.exports = mongoose.model("Room", roomSchema);