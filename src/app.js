const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('winston');
const path = require('path');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const sequelize = require('./sequelize');
const authentication = require('./authentication');

const swagger = require('feathers-swagger');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
// Set up database layer
app.configure(sequelize);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);

app.configure(swagger({
	docsPath: '/docs',
	uiIndex: path.join(__dirname, '..', 'public', 'docs.html'),
	schemes: ['http', 'https'],
	securityDefinitions: {
		jwt: {
			type: 'apiKey',
			description: '',
			name: 'Authorization',
			in: 'header',
		}
	},
	security: [
		{
			jwt: []
		}
	],
	info: {
		title: 'dustmap.org API',
		description: 'A description',
		version: '1.0.0-alpha',
	}
}));

app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);


// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
