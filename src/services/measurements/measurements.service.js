// Initializes the `measurements` service on path `/measurements`
const createService = require('feathers-sequelize');
const createModel = require('../../models/measurements.model');
const hooks = require('./measurements.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		name: 'measurements',
		Model,
		paginate
	};

	const measurements = createService(options);
	measurements.docs = {
		description: 'A service to manage measurements, taken by nodes.',
		definitions: {
			'measurements list': {
				type: 'array',
				items: {
					$ref: '#/definitions/measurements',
				},
			},
			measurements: {
				type: 'object',
				required: ['label', 'value'],
				properties: {
					label: {
						type: 'string',
						description: '',
					},
					value: {
						type: 'string',
						description: '',
					},
					unit: {
						type: 'string',
						description: '',
					},
				}
			}
		}
	};

	// Initialize our service with any options it requires
	app.use('/measurements', measurements);

	// Get our initialized service so that we can register hooks and filters
	const service = app.service('measurements');

	service.hooks(hooks);
};
