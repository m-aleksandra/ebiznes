const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		timestamps: true
	}
);

module.exports = User;