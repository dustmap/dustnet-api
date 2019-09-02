const { authenticate } = require('@feathersjs/authentication').hooks;
const { restrictToOwner } = require('feathers-authentication-hooks');
const checkPermissions = require('feathers-permissions');
const { iff } = require('feathers-hooks-common');

module.exports = function restrict(groups = [], allowOwner = false) {
	const allowed = [authenticate('jwt')];

	if (groups.length) {
		allowed.push(
			checkPermissions({ roles: groups, field: 'roles', error: allowOwner })
		);
	}

	if (allowOwner) {
		allowed.push(
			iff(({ params }) => !params.permitted, restrictToOwner({ idField: 'id', ownerField: 'userId'}))
		);
	}

	return allowed;
};
