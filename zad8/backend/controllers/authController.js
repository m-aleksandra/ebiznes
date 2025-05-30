const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
	try {
		const { email, password } = req.body;

		const existingUser = await User.findOne({
			where: {
				[Op.or]: [{ email }, { email }]
			}
		});

		if (existingUser) {
			return res
				.status(409)
				.json({ error: 'Username or email already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await User.create({
			email,
			password: hashedPassword,
		});

		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Registration failed' });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ error: 'Email and password are required' });
		}

		const user = await User.findOne({
			where: { email }
		});

		if (!user) {
			return res
				.status(401)
				.json({ error: 'No user with this username or email' });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: 'Authentication failed' });
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN
		});

		res.status(200).json({ token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Login failed' });
	}
};