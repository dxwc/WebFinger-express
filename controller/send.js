let router = require('express').Router();
let request = require('request');

let create =                 {
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://${process.env.d_host}/create-hello-world`,
    "type": "Create",
    "actor": `https://${process.env.d_host}/actor`,
    "object": {
        "id": `https://${process.env.d_host}/hello-world`,
        "type": "Note",
        "published": new Date().toISOString(),
        "attributedTo": `https://${process.env.d_host}/actor`,
        "inReplyTo": "https://mastodon.social/@hooman_but_testing/101914898963139901",
        "content": "<p>Hello world</p>",
        "to": "https://www.w3.org/ns/activitystreams#Public"
    }
};

router.post('/send', async (req, res) =>
{
    if(!req.body.inbox || !req.body.message) return res.status(400).json({});
    try
    {
        let result = await request.post
        (
            req.body.inbox.trim(),
            {
                body : JSON.stringify(create),
                headers :
                {
                    'host' : 'mastodon.social',
                    'Signature' : require('../sign_header.js'),
                    'Date' : new Date().toISOString(),
                }
            }
        );

        console.log(res);
        console.log(result.statusCode, result.body);
        return res.json(result.body);
    }
    catch(err)
    {
        console.error(err);
        return res.status(500).json({});
    }
});

module.exports = router;