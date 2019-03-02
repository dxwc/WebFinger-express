let express = require('express');
let app     = express();

let webFingerMW = require('../index.js')
({
    host : 'localhost:9005',
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

app.use(webFingerMW);
app.use((req, res) => res.status(404).send('404'));

app.listen('9005', () => console.log('Starting'));