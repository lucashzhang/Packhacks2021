const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const multer = require("multer");
const mkdirp = require("mkdirp");
const utils = require('./utils');

mkdirp('./ocr-convert-image-to-text/inputs', function(err) {
	if (err) console.log("Cant make dir");
	else console.log("made dir");
});

mkdirp('./ocr-convert-image-to-text/outputs', function(err) {
	if (err) console.log("Cant make dir");
	else console.log("made dir");
});

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "./ocr-convert-image-to-text/inputs");
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname);
	}
});

let intents_data = JSON.parse(fs.readFileSync('./chat-model/intents.json'));
let model_responses = {};

for (let i=0;i<intents_data.intents.length;i++) {
	model_responses[intents_data.intents[i].tag] = intents_data.intents[i].responses;
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

app.get('/', async (req, res) => {
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

app.post('/upload_img', (req, res) => {
	var upload = multer({ storage: storage }).single("file");
	console.log(upload);
	upload(req, res, (err) => {
        if (err) {
			console.log(err);
            return res.end("Error");
        }

		console.log("success");
		return res.end("Success");
    });
});


app.post('/parse_img', async (req, res) => {
	let convert = await utils.getProcess('python', ['./ocr-convert-image-to-text/main.py', '-i', './ocr-convert-image-to-text/inputs', '-o', './ocr-convert-image-to-text/outputs']);

	fs.readFile('./ocr-convert-image-to-text/outputs/' + req.body.filename, 'utf8', function(err, data) {
		if (err) throw err;
		let lines = data.split("\n");
		res.send(data.join(', '));
	});
});
