const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const multer = require("multer");
const mkdirp = require("mkdirp");
const utils = require('./utils');
const cors = require('cors');
let PythonShell = require('python-shell');

mkdirp('./ocr-convert-image-to-text/inputs', function(err) {
	if (err) console.log("Cant make dir");
	else console.log("made dir");
});

/*var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "./ocr-convert-image-to-text/inputs");
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname);
	}
});*/

let intents_data = JSON.parse(fs.readFileSync('./chat-model/intents.json'));
let model_responses = {};

for (let i=0;i<intents_data.intents.length;i++) {
	model_responses[intents_data.intents[i].tag] = intents_data.intents[i].responses;
}

const upload = multer({ dest: __dirname + "/ocr-convert-image-to-text/inputs" });

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
	//let convert = await utils.getProcess('sh', ['./ocr-convert-image-to-text/run_model.sh']);
	//let convert = await utils.getProcess('python', ['-u', __dirname + '/ocr-convert-image-to-text/test.py']);

	PythonShell.run('./ocr-convert-image-to-text/test.py', null, function(err, results) {
		if (err) throw err;
		console.log('results: %j', results);
	});

	console.log(convert);

	fs.readFile('./ocr-convert-image-to-text/out/' + req.query.filename + ".txt", 'utf8', function(err, data) {
		if (err) throw err;
		let lines = data.split("\n");
		res.send(data.join(', '));
	});

	res.send("Yeet");
});
