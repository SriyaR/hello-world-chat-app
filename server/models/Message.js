const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	content: String,
	from: String, 
	to: String,
}, {
	timestamps: true,
})

module.exports = mongoose.model('Message', schema);