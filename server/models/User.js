const mongoose = require("mongoose");

var roomSchema = new mongoose.Schema({
	roomName : String,
})
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
	unique: true,
  },
  email: {
    type: String,
    required: true,
	unique: true,
  },
  password: {
    type: String,
    required: true,
	minlength: 5,
  },
  room: [roomSchema]
});

module.exports = mongoose.model("User", userSchema);