module.exports = {
	getUnitByLabel: label => {
		switch (label) {
		case 'temperature':
			return '°C';
		case 'humidity':
			return '%';
		case 'pm25':
		case 'pm10':
			return 'ug / m³';
		default:

		}
	}
};
