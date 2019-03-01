module.exports = (data) =>
{
    // REQUIRED:
    // data.host <url>:<port> of the deployed site
    // data.resource
    return (req, res, next) =>
    {
        if(req.originalUrl.indexOf('/.well-known/webfinge/?') !== 0) return next();

        res.setHeader('Access-Control-Allow-Origin', '*');

        if(!req.secure)
        return res.redirect(`https://${data.host}${req.originalUrl}`);

        if
        (
            !req.query.resource ||
            req.query.resource.constructor === String ||
            !req.query.resource.trim().length
        )
        return res.status(400).send('Must contain resource');

        if(req.query.resource.trim() !== data.resource)
        return res.status(404)
        .send('Server has no information on the requested resource');

        res.contentType('application/jrd+json');
        // TODO: support rel
        return res.status(200).send(JSON.stringify(data));
    }
}