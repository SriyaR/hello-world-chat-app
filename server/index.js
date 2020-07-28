const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

const Room = require('./models/Room');
const mongoose = require('mongoose');

const cors = require('cors');

app.use(express.json());
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", require("./routes/userRoute"));
app.use("/rooms", require("./routes/roomRoute"));
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

mongoose.connect(uri, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
}).catch((err)=>{
	console.log(err);
});


io.on('connection', (socket) => {
	Room.find().sort({createdAt: -1}).exec((err, messages) => {
		if (err) return console.error(err);
		socket.emit('init',messages);	
	});
	socket.on('message', (msg) => {
		const message = new mongoose.Schema({
			content: msg.content,
			sender: msg.sender,
		});
		message.save((err)=>{
			if (err) return console.error(err);
		});
		socket.to(msg.from).emit('Message',msg);
	});
});

http.listen(port, () => {
	console.log('listening on *:'+port);
});