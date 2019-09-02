const http = require('http');

/** Hook to update the location of a node on on The Things Network.
*/
module.exports = function updateNodeLocationOnTTN() {
	return async ({ app, result }, next) => {

		if (!result) {
			next();
			return;
		}

		if (!result.currentLocationId) {
			next();
			return;
		}

		const currentLocation = await app.service('locations').get(result.currentLocationId);

		const { host, port, appId, appKey, devIdPrefix } = app.settings.ttn;

		const devId = devIdPrefix + result.id.toString().padStart(6, 0);
		const data = {
			dev_id: devId,
			latitude: currentLocation.coordinates.coordinates[0],
			longitude: currentLocation.coordinates.coordinates[0],
			altitude: currentLocation.altitude,
		};

		const request = http.request({
			method: 'POST',
			host,
			path: '/applications/' + appId + '/devices/' + devId,
			port,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Key ' + appKey,
			},
		},
		response => {
			if (response.statusCode < 200 || response.statusCode > 299) {
				// TODO Do something?
				return;
			}

			next();
		});

		request.write(JSON.stringify(data));
		request.end();
	};
};
