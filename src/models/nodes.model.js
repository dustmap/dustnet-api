const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	// const { devIdPrefix } = app.settings.ttn;
	const sequelizeClient = app.get('sequelizeClient');
	const nodes = sequelizeClient.define('nodes', {
		devId: {
			type: DataTypes.STRING,
			unique: true,
			// validate: {
			// 	is: new RegExp(`^${devIdPrefix}d{6}$`),
			// }
		},
		devEUI: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				is: /^[0-9a-f]{16}$/,
			}
		},
		private: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		lastSeen: {
			type: DataTypes.DATE
		}
	}, {
		indexes: [{
			unique: true,
			fields: ['devId', 'devEUI']
		}],
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});

	nodes.associate = function (models) {
		nodes.belongsTo(models.users);
		nodes.hasMany(models.measurements);
		// nodes.hasMany(models.locations);
		nodes.belongsTo(models.locations, { as: 'currentLocation', foreignKey: 'currentLocationId'});
	};

	return nodes;
};
