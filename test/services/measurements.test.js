const assert = require('assert');
const app = require('../../src/app');

describe('\'measurements\' service', () => {
	it('registered the service', () => {
		const service = app.service('measurements');

		assert.ok(service, 'Registered the service');
	});
});
