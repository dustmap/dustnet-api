// Initializes the `nodes` service on path `/nodes`
const createService = require('feathers-sequelize');
const createModel = require('../../models/nodes.model');
const hooks = require('./nodes.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		name: 'nodes',
		Model,
		paginate
	};

	const nodes = createService(options);
	nodes.docs = {
		description: 'A service to manage nodes.',
		definitions: {
			'nodes list': {
				type: 'array',
				items: {
					$ref: '#/definitions/nodes',
				},
			},
			nodes: {
				type: 'object',
				required: ['devId'],
				properties: {
					devId: {
						type: 'string',
						pattern: '/^[0-9A-F]{4}-[0-9A-F]{4}$/',
						uniqueItems: true,
						description: 'Unique id of the node.'
					},
					private: {
						type: 'boolean',
						default: true,
					},
					lastSeen: {
						type: 'string',
						format: 'date-time',
						description: 'Last activity of the node.',
					},
					userId : {
						type: 'object',
						readOnly: true,
						description: 'A user, the node is connected to.',
					}
				}
			}
		}
	};

	// Initialize our service with any options it requires
	app.use('/nodes', nodes);

	// Get our initialized service so that we can register hooks and filters
	const service = app.service('nodes');

	service.hooks(hooks);
};
