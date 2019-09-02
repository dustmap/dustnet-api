const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
// const { restrictToRoles } = require('feathers-authentication-hooks');
const { discard } = require('feathers-hooks-common');
const dehydrate = require('feathers-sequelize/hooks/dehydrate');

const restrict = require('../../hooks/permissions');

const includeAssociations = () =>
	hook => {
		const association = {
			include: [{
				model: hook.app.service('nodes').Model,
				attributes: ['id', 'devId'],
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
		find: [...restrict(), includeAssociations()],
		get: [...restrict(), includeAssociations()],
		create: [discard('roles'), hashPassword()],
		update: [...restrict(['admin', 'moderator'], true), hashPassword()],
		patch: [...restrict(['admin', 'moderator'], true), hashPassword()],
		remove: [...restrict(['admin', 'moderator'])]
	},

	after: {
		all: [
			// Make sure the password field is never sent to the client
			// Always must be the last hook
			protect('password')
		],
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
