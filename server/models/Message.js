const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	message: String,
	sender: String, 
	room: String,
}, {
	timestamps: true,
})

module.exports = mongoose.model('Message', schema);