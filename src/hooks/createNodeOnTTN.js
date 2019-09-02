const crypto = require('crypto');
const http = require('http');

/** Hook to create a node on The Things Network.
*/
module.exports = function createNodeOnTTN () {
	return ({ app, result }, next) => {

		if (!result) {
			next();
			return;
		}

		next();
		return;

		const { host, port, appId, appEui, appKey, devIdPrefix } = app.settings.ttn;

		const devId = devIdPrefix + result.id.toString().padStart(6, 0);
		const data = {
			dev_id: result.devId || devId,
			description: '✪ Created ' + new Date().toLocaleDateString() + ' via dustnet API.',
			// latitude: 0,
			// longitude: 0,
			// altitude: 0,
			lorawan_device: {
				app_id: appId,
				app_eui: appEui,
				dev_id: result.devId || devId,
				dev_eui: result.devEUI || crypto.randomBytes(8).toString('hex'),
				app_key: result.appKey || crypto.randomBytes(16).toString('hex'),
				// app_s_key: crypto.randomBytes(16).toString('hex'),
				// nwk_s_key: crypto.randomBytes(16).toString('hex'),
				activation_constraints: 'otaa',
				uses32_bit_f_cnt: true
			}
		};

		const request = http.request({
			method: 'POST',
			host,
			path: '/applications/' + appId + '/devices',
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

			app.service('nodes').patch(
				result.id, {
					devId: devId,
					devEUI: data.lorawan_device.dev_eui,
					appKey: data.lorawan_device.app_key,
				}
			);

			result.devId = devId;
			result.devEUI = data.lorawan_device.dev_eui;
			result.appKey = data.lorawan_device.app_key;

			next();
		});

		// request.on('error', (err) => console.log(err));
		request.write(JSON.stringify(data));
		request.end();
	};
};
