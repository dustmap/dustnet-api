const restrict = require('../../hooks/permissions');

module.exports = {
	before: {
		all: [],
		find: [...restrict(['admin', 'moderator'], true)],
		get: [...restrict(['admin', 'moderator'], true)],
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
