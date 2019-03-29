let crypto = require('crypto');
let permKey = require('fs').readFileSync('./private.pem', 'ascii');
let sigGen = crypto.createSign('SHA256');
let keyId = `http://localhost:9005/actor#main-key`;
sigGen.write(keyId);
sigGen.end();
let signature = sigGen.sign(permKey, 'base64');
let header = `keyId="${keyId}",headers="(request-target) host date",signature="` +
              signature + '"';

module.exports = (req, res, next) =>
{
    res.set('Signature', header);
    next();
}