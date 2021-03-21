const process = require("child_process");
const https = require('https');
const urlParser = require('url');

module.exports = {
	getRequest: function(url) {
		console.log(`Sending http GET call to ${url}...`);
		return new Promise(resolve => {
			var opts = urlParser.parse(url);
			opts.headers = {
			  'User-Agent': 'javascript'
			};

			https.get(opts, (res) => {
				let data = '';
				console.log(`http GET to ${url} resulted in status code:`);
				console.log(res.statusCode);

				res.on('data', (chunk) => {
					data += chunk;
				});

				res.on('end', () => {
					resolve(JSON.parse(data));
				});
			}).on("error", (err) => {
				console.log("Error: " + err.message);
				resolve("error");
			});
		});
	},

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
