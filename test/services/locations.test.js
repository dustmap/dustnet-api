const assert = require('assert');
const app = require('../../src/app');

describe('\'locations\' service', () => {
	it('registered the service', () => {
		const service = app.service('locations');

		assert.ok(service, 'Registered the service');
	});
});
