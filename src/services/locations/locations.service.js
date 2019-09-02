// Initializes the `locations` service on path `/locations`
const createService = require('feathers-sequelize');
const createModel = require('../../models/locations.model');
const hooks = require('./locations.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		name: 'locations',
		Model,
		paginate
	};

	const locations = createService(options);
	locations.docs = {
		description: 'A service to manage the location of nodes.',
		definitions: {
			'locations list': {
				type: 'array',
				items: {
					$ref: '#/definitions/locations',
				},
			},
			locations: {
				type: 'object',
				required: ['coordinates'],
				properties: {
					coordinates: {
						type: 'string',
						description: '',
					},
				}
			}
		}
	};

	// Initialize our service with any options it requires
	app.use('/locations', locations);

	// Get our initialized service so that we can register hooks and filters
	const service = app.service('locations');

	service.hooks(hooks);
};
