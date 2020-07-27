const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Room = require("../models/Room");

router.post("/create", async (req, res) => {
	try{
		const users = req.body.users;
		const name = req.body.name;
		if (!name || !users)
			return res.status(400).json({msg:'Required fields have to be filled'});
		const existingRoom = await Room.findOne({name: name});
		if (existingRoom)
			return res.status(400).json({msg:'Room Name already exists'});
		const updates = []
		const userList = []
		for (var username of users) {
			const existingUser = await User.findOne({name: username});
			if (!existingUser)
				return res.status(400).json({msg:'Display Name does not exist'});
			
			updates.push({ updateOne: { filter: {"name" : username}, update: {$addToSet:{"room": {"roomName": name}}}}});
			userList.push({"username": username})
		}
		const newRoom = new Room({
			name,
			users: userList,
		});
		const savedRoom = await newRoom.save();
		await User.bulkWrite(updates,  {options:{bypassDocumentValidation: true}});
		res.json(savedRoom);
		
	}catch(err){
		res.status(500).json({error: err.message});
	}
});

module.exports = router;