const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const utils = require('./utils');

let intents_data = JSON.parse(fs.readFileSync('./chat-model/intents.json'));
let model_responses = {};

for (let i=0;i<intents_data.intents.length;i++) {
	self_tags[intents_data.intents[i].tag] = intents_data.intents[i].responses;
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

const httpsServer = https.createServer({
	key: fs.readFileSync('/etc/letsencrypt/live/api.aszala.com/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/api.aszala.com/fullchain.pem')
}, app);

httpsServer.listen(port, () => {
	console.log("Done.");
	console.log(`Server active at https://localhost:${port}`);
});

app.get('/', (req, res) => {
	let command = req.query.cmd;
	let action = await utils.getProcess('python', ['./chat-model/parse.py', command]);

	responses = model_responses[action];

	const randomResponse = responses[Math.floor(Math.random() * responses.length)];
	let finalResponse = randomResponse;

	if (randomResponse.includes("api")) {
		api = randomResponse.split(":")[1];

		finalResponse = await utils.getRequest(api + command);
	}

	res.send(`${finalResponse}`);
});
