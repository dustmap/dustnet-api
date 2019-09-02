// Initializes the `users` service on path `/users`
const createService = require('feathers-sequelize');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');

	const options = {
		name: 'users',
		Model,
		paginate
	};

	const users = createService(options);
	users.docs = {
		description: 'A service to manage user subscriptions.',
		securities: ['find', 'get', 'update', 'patch', 'remove'],
		definitions: {
			'users list': {
				type: 'array',
				items: {
					$ref: '#/definitions/users',
				},
			},
			users: {
				type: 'object',
				required: ['email', 'password'],
				properties: {
					name: {
						type: 'string',
						description: 'A users public name.'
					},
					email: {
						type: 'string',
						format: 'email',
						uniqueItems: true,
						description: 'A users email address.',
					},
					password: {
						type: 'string',
						writeOnly: true,
						minLength: 6,
						maxLength: 255,
						description: 'A users secret password.',
					},
					roles: {
						type: 'string',
						enum: ['user', 'moderator', 'admin'],
						default: 'user',
						description: 'A users role.',
					},
					nodes : {
						type: 'array',
						readOnly: true,
						items: {
							$ref: '#/definitions/nodes',
						},
						description: 'Nodes, connected to a user.',
					}
				}
			}
		}
	};

	// Initialize our service with any options it requires
	app.use('/users', users);

	// Get our initialized service so that we can register hooks and filters
	const service = app.service('users');


	service.hooks(hooks);
};
