require('dotenv').config();
const sequelize = require('./config/database');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
	origin: process.env.CLIENT_URL || 'http://localhost:5137', 
	credentials: true,
  }));

app.use(express.json());
app.use(cors({
	origin: process.env.CLIENT_URL || 'http://localhost:5173', 
	credentials: true,
  }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
	console.log('Database synchronized');
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});