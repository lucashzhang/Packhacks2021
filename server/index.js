const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');

let intents_data = JSON.parse(fs.readFileSync('./chat-model/intents.json'));
let self_tags = [];

for (let i=0;i<intents_data.intents.length;i++) {
	self_tags.push(intents_data.intents[i].tag);
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;

const httpsServer = https.createServer({
	key: fs.readFileSync('/etc/letsencrypt/live/api.aszala.com/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/api.aszala.com/fullchain.pem')
}, app);

httpsServer.listen(port, () => {
	console.log("Done.");
	console.log(`Server active at https://localhost:${port}`);
});

app.get('/', (req, res) => {
	res.send("Hello World");
});
