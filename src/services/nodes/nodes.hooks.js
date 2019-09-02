const { protect } = require('@feathersjs/authentication-local').hooks;
const { discard } = require('feathers-hooks-common');
const dehydrate = require('feathers-sequelize/hooks/dehydrate');

const createNodeOnTTN = require('../../hooks/createNodeOnTTN');
// const updateNodeLocationOnTTN = require('../../hooks/updateNodeLocationOnTTN');
const restrict = require('../../hooks/permissions');

const includeAssociations = () =>
	hook => {
		const association = {
			include: [{
				model: hook.app.service('locations').Model,
				as: 'currentLocation',
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
		create: [
			discard('lastSeen'),
			...restrict(['admin', 'moderator']),
		],
		update: [...restrict(['admin', 'moderator'], true)],
		patch: [...restrict(['admin', 'moderator'], true)],
		remove: [...restrict(['admin', 'moderator'], true)]
	},

	after: {
		all: [protect('currentLocationId')],
		find: [protect('appKey'), protect('pin')],
		get: [protect('appKey'), protect('pin')],
		create: [createNodeOnTTN()],
		update: [/*updateNodeLocationOnTTN()*/],
		patch: [/*updateNodeLocationOnTTN()*/],
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
