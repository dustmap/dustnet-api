const { Validator } = require('express-json-validator-middleware');
const https = require('https');
var querystring = require('querystring');

module.exports = function (app) {
	const validator = new Validator({ allErrors: true });
	const ttnImportSchema = {
		type: 'object',
		required: ['app_id', 'hardware_serial', 'payload_fields', 'metadata'],
		properties: {
			app_id: {
				type: 'string'
			},
			hardware_serial: {
				type: 'string'
			},
			payload_fields: {
				type: 'object'
			},
			metadata: {
				type: 'object',
				required: ['time']
			}
		}
	};

	/** Import from TheThingsNetwork via http integration
	 *  See https://www.thethingsnetwork.org/docs/applications/http/
	 */
	app.post('/ttn/import', validator.validate({ body: ttnImportSchema }), async (req, res) => {
		const { app_id, hardware_serial, payload_fields } = req.body;
		const { appId } = app.settings.ttn;

		if (app_id !== appId) {
			res.status(500).send();
			return false;
		}

		const nodes = await app.service('nodes')
			.find({
				query: {
					$limit: 1,
					devEUI: hardware_serial.toLowerCase()
				}
			});

		if (nodes.total === 0) {
			res.status(500).send();
			return false;
		}

		const node = await app.service('nodes')
			.patch(nodes.data[0].id, {
				lastSeen: new Date
			});

		Object.keys(payload_fields).forEach(label => {
			if (!label.startsWith('sensor')) {
				return;
			}

			app.service('measurements')
				.create({
					label: label,
					value: payload_fields[label],
					nodeId: node.id,
					locationId: node.currentLocationId
				});
		});

		res.send();
	});

	const slackInviteSchema = {
		type: 'object',
		required: ['email'],
		properties: {
			email: {
				type: 'string',
				format: 'email',
			},
		}
	};

	/** Automate Slack invitations
	 *  See https://github.com/ErikKalkoken/slackApiDoc/blob/master/users.admin.invite.md
	 */
	app.post('/slack/invite', validator.validate({ body: slackInviteSchema }), (req, res) => {
		const { email } = req.body;
		const { token } = app.settings.slack;

		inviteToSlack(token, email)
			.then((html) => res.send(html))
			.catch((err) => res.status(500).send(err));
	});
};

const inviteToSlack =
	(token, email) => new Promise((resolve, reject) => {
		const data = querystring.stringify({
			resend: true,
			token,
			email,
		});

		const request = https.request({
			method: 'POST',
			host: 'dustmap.slack.com',
			path: '/api/users.admin.invite',
			port: 443,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(data)
			},
		},
		response => {
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(response.statusCode);
			}
			const body = [];

			response.setEncoding('utf8');
			response.on('data', (chunk) => body.push(chunk));
			response.on('end', () => resolve(
				JSON.parse(body.join(''))
			));
		});

		request.on('error', (err) => reject(err));
		request.write(data);
		request.end();
	});
