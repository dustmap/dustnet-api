const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const locations = sequelizeClient.define('locations', {
		coordinates: {
			type: DataTypes.GEOMETRY('POINT'),
			validate: {
				notEmpty: true,
			},
		},
		altitude: {
			type: DataTypes.INTEGER,
		},
		indoor: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
	}, {
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});

	locations.associate = function (models) {
		locations.hasMany(models.measurements);
	};

	return locations;
};
