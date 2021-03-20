const process = require("child_process");

module.exports = {
	getProcess: function(type, params) {
		return new Promise(resolve => {
			let out = process.spawn(type, params);
			let data = '';

			out.stdout.on('data', (chunk) => {
				data += chunk;
			});

			out.stdout.on('end', () => {
				resolve(JSON.parse(data));
			});
		});
	}
};
