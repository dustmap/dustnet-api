const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const users = sequelizeClient.define('users', {
		name: {
			type: DataTypes.STRING
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [6, 255],
			}
		},
		roles: {
			type: DataTypes.ENUM,
			values: ['user', 'moderator', 'admin'],
			defaultValue: 'user'
		}
	}, {
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});

	users.associate = function (models) {
		users.hasMany(models.nodes);
	};

	return users;
};
