let router = require('express').Router();

// tofix: validator does not recognize as email with port, should it ?
router.use(require('../send_webfinger.js')
({
    subject : `test@${process.env.d_host}`,
    links :
    [
        {
            rel : 'self',
            type : 'application/activity+json',
            href : `https://${process.env.d_host}/actor`
        }
    ]
}, process.env.debug));

let path = require('path');
let pubkey = require('fs').readFileSync
(path.join(path.dirname(__filename), '../public.pem') , { encoding : 'utf-8'});
router.use(require('../send_activitystream.js')
({
	"@context": [
		"https://www.w3.org/ns/activitystreams",
		"https://w3id.org/security/v1"
	],

	"id": `http://${process.env.d_host}/actor`,
	"type": "Person",
	"preferredUsername": "test",
	"inbox": `http://${process.env.d_host}/inbox`,

	"publicKey": {
		"id": `http://${process.env.d_host}/actor#main-key`,
		"owner": `http://${process.env.d_host}/actor`,
		"publicKeyPem": pubkey
	}
}, process.env.debug));
router.use(require('./send.js'));
router.use(require('./home.js'));
router.use(require('./404.js')); // last route

module.exports = router;