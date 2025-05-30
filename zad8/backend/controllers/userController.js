const User = require('../models/User');

const getUser = async (req, res) => {
	const { id } = req.params;

    if (parseInt(id) !== req.userId) {
		return res.status(403).json({ error: 'Forbidden' });
	}

	try {
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.json(user);
	} catch (err) {
		console.error('Error fetching user:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};





module.exports = {
	getUser
};