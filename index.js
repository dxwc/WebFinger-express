const express  = require('express');
const app      = express();
const helmet   = require('helmet');
const https    = require('https');
const fs       = require('fs');

/*
let https_options;
if(process.env.fullchain && process.env.privkey) https_options =
{
    cert: fs.readFileSync(process.env.fullchain),
    key: fs.readFileSync(process.env.privkey)
};

app.use(helmet());

if(process.env.fullchain && process.env.privkey) app.use((req, res, next) =>
{
    if(!req.secure)
        return res.redirect(['https://', process.env.d_host, req.url].join(''));
    else
        next();
});
*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./view/public/'));

require('ejs').delimiter = '?';
app.set('view engine', 'ejs');
app.set('views', './view/template/');

app.use(require('./controller/'));

let http_server = app.listen(process.env.PORT || '9001')
.on('listening', () =>
{
    /*
    if(process.env.fullchain && process.env.privkey)
        https.createServer(https_options, app).listen(443);
        */
    console.info
    (
        '- HTTP server started,',
        http_server.address().family === 'IPv6' ?
            'http://[' + http_server.address().address + ']:'
            + http_server.address().port
            :
            'http://' + http_server.address().address + ':'
            + http_server.address.port
    );
});