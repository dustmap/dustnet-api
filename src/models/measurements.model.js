const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const measurements = sequelizeClient.define('measurements', {
		label: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		value: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		}
	}, {
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});

	measurements.associate = function (models) {
		measurements.belongsTo(models.nodes, { as: 'node', foreignKey: 'nodeId' });
		measurements.belongsTo(models.locations, { as: 'location', foreignKey: 'locationId' });
	};

	return measurements;
};
