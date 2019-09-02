const restrict = require('../../hooks/permissions');
const dehydrate = require('feathers-sequelize/hooks/dehydrate');

const includeAssociations = () =>
	hook => {
		const association = {
			include: [{
				model: hook.app.service('locations').Model,
				as: 'location',
				attributes: ['coordinates', 'altitude', 'indoor'],
			}]
		};

		if (hook.type === 'before') {
			hook.params.sequelize = Object.assign(association, { raw: false });
			return Promise.resolve(hook);
		}

		dehydrate(association).call(this, hook);
	};

module.exports = {
	before: {
		all: [],
		find: [includeAssociations()],
		get: [includeAssociations()],
		create: [...restrict(['admin', 'moderator', 'user'])],
		update: [...restrict(['admin', 'moderator'])],
		patch: [...restrict(['admin', 'moderator'])],
		remove: [...restrict(['admin', 'moderator'])]
	},

	after: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
