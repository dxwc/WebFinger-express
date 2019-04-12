let crypto = require('crypto');
let permKey = require('fs').readFileSync('./private.pem', 'ascii');
let sigGen = crypto.createSign('SHA256');
// ideally keyid will be fetched from activitystreams publicKey.id
// but I am assuming that would be same as host/actor#main-key
let keyId = `http://${process.env.d_host}/actor#main-key`;
sigGen.write(keyId);
sigGen.end();
let signature = sigGen.sign(permKey, 'base64');
let header = `keyId="${keyId}",headers="(request-target) host date",signature="` +
              signature + '"';

module.exports = header;
/*
module.exports = (req, res, next) =>
{
    res.set('Signature', header);
    next();
}
*/