const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
	try{
		const email = req.body.email;
		const password = req.body.password;
		const name = req.body.name;
		if (!name || !email || !password)
			return res.status(400).json({msg:'Required fields have to be filled'});
		if (password.length<5 || password.length>15)
			return res.status(400).json({msg:'Password length has to be between 5 and 15 characters'});
		const existingUser = await User.findOne({email: email});
		if (existingUser)
			return res.status(400).json({msg:'User account for this mail exists'});
		const existingName = await User.findOne({name: name});
		if (existingName)
			return res.status(400).json({msg:'Display Name already exists'});
		
		const salt = await bcrypt.genSalt();
		const passHash = await bcrypt.hash(password, salt);
		
		const newUser = new User({
			name,
			email,
			password: passHash,
		});
		const savedUser = await newUser.save();
		res.json(savedUser);
		
	}catch(err){
		res.status(500).json({error: err.message});
	}
});

router.post("/login", async (req, res) => {
	try{
		const email = req.body.email;
		const password = req.body.password;
		if (!email || !password)
			return res.status(400).json({msg:'Required fields have to be filled'});
		const user = await User.findOne({email: email});
		if (!user)
			return res.status(400).json({msg:'No user exists for this email'});
		
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({msg:'Password is incorrect'});
		
		const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN);
		res.json({
			token, 
			user: {
				id: user._id,
				name: user.name,
			},
		});
		
	}catch(err)
	{
		res.status(500).json({error: err.message});
	}
});

router.post("/getRoom", async (req, res) => {
	try{
		const name = req.body.name;
		if (!name)
			return res.status(400).json({msg:'Required fields have to be filled'});
		const user = await User.findOne({name: name});
		if (!user)
			return res.status(400).json({msg:'No user exists for this email'});
		
		const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN);
		res.json({
			token, 
			user: {
				id: user._id,
				name: name, 
				room: user.room,
			},
		});
		
	}catch(err)
	{
		res.status(500).json({error: err.message});
	}
});

module.exports = router;