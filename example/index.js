let express = require('express');
let app     = express();

let webFingerMW = require('../send_webfinger.js')
({
    host : 'localhost:9005', // <-- not required for webfinger but required for mw
    subject : 'bob@example.com',
    links :
    [
        {
            rel : 'self',
            type : 'application/activity+json',
            href : 'https://example.com/actor'
        }
    ]
}, true);

let activityStreamMW = require('../send_activitystream.js')
({
	"@context": [
		"https://www.w3.org/ns/activitystreams",
		"https://w3id.org/security/v1"
	],

	"id": "http://localhost:9005/actor",
	"type": "Person",
	"preferredUsername": "alice",
	"inbox": "http://localhost:9005/inbox",

	"publicKey": {
		"id": "http://localhost:9005/actor#main-key",
		"owner": "http://localhost:9005/actor",
		"publicKeyPem": "-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----"
	}
}, true);

app.use(webFingerMW);
app.use(activityStreamMW);
app.use((req, res) => res.status(404).send('404'));

app.listen('9005', () => console.log('Starting'));