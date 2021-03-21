const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const multer = require("multer");
const mkdirp = require("mkdirp");
const utils = require('./utils');
const cors = require('cors');
const WolframAlphaAPI = require('wolfram-alpha-api');

mkdirp('./ocr-convert-image-to-text/inputs', function(err) {
	if (err) console.log("Cant make dir");
	else console.log("made dir");
});


let intents_data = JSON.parse(fs.readFileSync('./chat-model/intents.json'));
let model_responses = {};

for (let i=0;i<intents_data.intents.length;i++) {
	model_responses[intents_data.intents[i].tag] = intents_data.intents[i].responses;
}

const upload = multer({ dest: __dirname + "/ocr-convert-image-to-text/inputs" });
const waApi = WolframAlphaAPI('6APH22-4T64A44K97');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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

	let action = await utils.getProcess('python3', ['-u', './chat-model/parse.py', command]);
	action = String(action).trim();

	responses = model_responses[action];

	let finalResponse = '';

	try {
		const randomResponse = responses[Math.floor(Math.random() * responses.length)];
		finalResponse = randomResponse;

		if (randomResponse.includes("api") || randomResponse.includes("redirect")) {
			api = randomResponse.split("$")[1];
			finalResponse = await summonTheWolf(command);
		}
	} catch (e) {
		finalResponse = await summonTheWolf(command);
	}

	res.send(`${finalResponse}`);
});

async function summonTheWolf(command) {
	return new Promise(resolve => {
		waApi.getFull(command).then((queryresult) => {
			const pods = queryresult.pods;
			const output = pods.map((pod) => {
				const subpodContent = pod.subpods.map(subpod => `<img src="${subpod.img.src}" alt="${subpod.img.alt}">`).join('\n');
				return `<h2>${pod.title}</h2>\n${subpodcontent}`;
			}).join('\n');

			resolve(output);
		}).catch(console.error);
	});
}

app.post('/upload_img', upload.single('file'), (req, res) => {
	if (req.file) {
		fs.rename(__dirname + "/ocr-convert-image-to-text/inputs/" + req.file.filename, __dirname + "/ocr-convert-image-to-text/inputs/" + req.file.filename + ".png", function(err) {
			if (err) {
				console.log(err);
			}
		});

		res.send(req.file.filename);
	} else {
		res.send("Error");
	}
});


app.get('/parse_img', async (req, res) => {
	let convert = await utils.getProcess('python3', ['-u', './ocr-convert-image-to-text/main.py', '-i', './ocr-convert-image-to-text/inputs/', '-o', './ocr-convert-image-to-text/out/']);

	fs.readFile('./ocr-convert-image-to-text/out/' + req.query.filename + ".txt", 'utf8', function(err, data) {
		if (err) throw err;
		let lines = data.replace('\f', '').split("\n");
		console.log(lines.join(', '));
		res.send(lines.join(', '));
	});
});
