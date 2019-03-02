module.exports = (data, debug) =>
{
    // REQUIRED:
    // data.host <url>:<port> of the deployed site
    // data.resource
    // data.links
    // and each item in links, ther must be a rel

    let host = data.host;
    delete data.host;

    let all_rels = { };
    data.links.forEach((obj) => all_rels[obj.rel] = obj);
    data.links = [];

    return (req, res, next) =>
    {
        if(req.originalUrl.indexOf('/.well-known/webfinger') !== 0) return next();

        res.setHeader('Access-Control-Allow-Origin', '*');

        if(!req.secure && !debug)
        return res.redirect(`https://${host}${req.originalUrl}`);

        if
        (
            !req.query.resource ||
            req.query.resource.constructor !== String ||
            !req.query.resource.trim().length
        )
        return res.status(400).send('Must contain resource');

        if(req.query.resource.trim() !== data.subject)
        return res.status(404)
        .send('Server has no information on the requested resource');

        res.contentType('application/jrd+json');
        let data_copy = data;
        if(req.query.rel)
        {
            if(req.query.rel.constructor === String) req.query.rel = [req.query.rel];
            req.query.rel.forEach((rel) =>
            {
                if(all_rels.hasOwnProperty(rel)) data_copy.links.push(all_rels[rel]);
            });
        }

        return res.status(200).send(JSON.stringify(data_copy, null, '    '));
    }
}