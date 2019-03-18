let addr = require('email-addresses');
let request = require('request');
let mime = require('mime-types');

async function requester(url, opt)
{
    return new Promise((resolve, reject) =>
    {
        request.get(url, opt)
        .on('response', (res) =>
        {
            let data = '';
            if(res.statusCode !== 200)
            {
                return resolve
                ([
                    res.statusCode,
                    res.headers['content-type'],
                    data
                ]);
            }

            res.on('data', chunk => data += chunk)
            res.on('close', () =>
            {
                return resolve
                ([
                    res.statusCode,
                    res.headers['content-type'],
                    data
                ]);
            });
        })
        .on('error', (err) => reject(err));
    })
}

async function get_webfinger(url)
{
    return requester
    (
        url,
        {
            headers:
            {
                'User-Agent': '',
                'Accept' : `application/ld+json`
            }
        }
    );
}

const ACCEPT = `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`;
async function get_actor(url)
{
    return requester
    (
        url,
        {
            headers:
            {
                'User-Agent': '',
                'Accept' : ACCEPT
            }
        }
    );
}

// todo: https://www.npmjs.com/package/webfinger.js
async function print_user(email)
/** example */
{
    try
    {
        let parsed = addr.parseOneAddress(email);

        let res = await get_webfinger
        (`https://${parsed.domain}/.well-known/webfinger?resource=${email}`);

        // might not need full response, if status is 200 user exists
        if(res[0] !== 200 || !res[1] || res[1].length === 0)
            return new Error('User not found');

        if(mime.contentType(res[1]).indexOf('application/jrd+json') === -1)
        {
            // console.log('Unexpected content type', res[1]);
        }

        console.log(JSON.parse(res[2]));
        console.log('\n\n');

        res = await get_actor(`https://${parsed.domain}/@${parsed.local}`);
        if(res[0] !== 200 || !res[1] || res[1].length === 0)
            return new Error('Actor not found');

        if(mime.contentType(res[1]).indexOf('application/jrd+json') === -1)
        {
            console.log('Unexpected content type', res[1]);
            console.log('\n\n');
        }

        return console.log(JSON.parse(res[2]));
    }
    catch(err)
    {
        console.error(err);
        return new Error(err);
    }
}

/**
 * returns object with inbox and outboxes, else returns error
 */
async function get_boxes(email)
{
    try
    {
        let parsed = addr.parseOneAddress(email);
        let res = await get_actor(`https://${parsed.domain}/@${parsed.local}`);

        if(res[0] !== 200 || !res[1] || res[1].length === 0)
            return new Error('Actor not found');

        let out = {  };
        res = JSON.parse(res[2]);
        out.inbox = res.inbox;
        out.outbox = res.outbox;
        delete res;
        return out;
    }
    catch(err)
    {
        return err;
    }
}

module.exports.get_boxes = get_boxes;

/*
get_boxes('rosjackson@wandering.shop')
.then((res) =>
{
    console.log(res);
})
.catch((err) =>
{
    console.error(err);
})
*/