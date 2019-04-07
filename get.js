let addr    = require('email-addresses');
let request = require('request');
let val     = require('validator');

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

async function activitystream(user)
{
    try
    {
        let user_self = '';
        if(val.isEmail(user))
        {
            let parsed = addr.parseOneAddress(user);
            let res = await get_webfinger
            (
                `https://${parsed.domain}/.well-known/webfinger?` +
                `resource=${user}&rel=self`
            );

            if(res[0] !== 200 || !res[2] || res[2].length === 0)
                return new Error('Webfinger not found');

            res = JSON.parse(res[2]);
            for(let i = 0; i < res.links.length; ++i)
            {
                if(res.links[i].rel === 'self')
                {
                    if(res.links[i].type)
                    {
                        if(res.links[i].type.indexOf('activity'))
                        {
                            user_self = res.links[i].href;
                            break;
                        }
                    }
                    else
                    {
                        user_self = res.links[i].href;
                        break;
                    }
                }
            }
        }

        if(user_self.length === 0)
        {
            if(!val.isURL(user)) return new Error('Invalid user', user);
            user_self = user;
        }

        let res = await get_actor(user_self);

        if(res[0] !== 200 || !res[2] || res[2].length === 0)
            return new Error('Actor not found');

        return JSON.parse(res[2]);
    }
    catch(err)
    {
        return err;
    }
}

module.exports.activitystream = activitystream;