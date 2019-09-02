const users = require('./users/users.service.js');
const nodes = require('./nodes/nodes.service.js');
const locations = require('./locations/locations.service.js');
const measurements = require('./measurements/measurements.service.js');

module.exports = function (app) {
	app.configure(users);
	app.configure(nodes);
	app.configure(locations);
	app.configure(measurements);
};
