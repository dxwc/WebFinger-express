module.exports = (data, do_not_redirect_to_https) =>
{
    // REQUIRED:
    // data.host <url>:<port> of the deployed site

    delete data.host; // todo make env var
    if
    (
        !data['@context'] ||
        !data['id']       ||
        !data['inbox']    ||
        !data['publicKey'] ||
        !data['publicKey']['id'] ||
        data['publicKey']['owner'] !== data['id'] ||
        !data['publicKey']['publicKeyPem']
    )
    {
        console.log('Requried data not found in send_activitystream.js');
        return (req, res, next) => next();
    }

    return (req, res, next) =>
    {
        if(!req.secure && !do_not_redirect_to_https)
            return res.redirect(`https://${host}${req.originalUrl}`);

        if
        (
            req.get('Accept').indexOf(`application/ld+json`) === -1  ||
            req.method !== 'GET'                      ||
            req.originalUrl.indexOf('/actor') !== 0 // could be better
        )
        {
            return next();
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.contentType('application/jrd+json');

        return res.send(JSON.stringify(data, null, '    '));
    }
}