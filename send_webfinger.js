module.exports = (data, do_not_redirect_to_https) =>
{
    // REQUIRED:
    // data.resource <string>
    // data.links <array>
    //  - Each object in data.links must contain a rel
    //     - rels are expected to be unique [ although spec does not specify it ]. If
    //       and rel repeats, the last of a rel will be used

    let all_rels = { };
    data.links.forEach((obj) => all_rels[obj.rel] = obj);
    data.links = [];

    Object.getOwnPropertyNames(all_rels)
    .forEach((rel) => data.links.push(all_rels[rel]));

    return (req, res, next) =>
    {
        if
        (
            req.path.indexOf('/.well-known/webfinger') !== 0 ||
            req.method !== 'GET'
        ) return next();

        res.setHeader('Access-Control-Allow-Origin', '*');

        /*
        if(!req.secure && !do_not_redirect_to_https)
        return res.redirect(`https://${process.env.d_host}${req.originalUrl}`);
        */

        if
        (
            !req.query.resource ||
            req.query.resource.constructor !== String ||
            !req.query.resource.trim().length
        )
        return res.status(400).send('Must contain resource query parameter');

        if(req.query.resource.indexOf('acct:') === 0)
        {
            req.query.resource = req.query.resource.substring(5);
            console.log(req.query.resource);
        }
        if(req.query.resource.trim() !== data.subject)
        return res.status(404)
        .send('Server has no information on the requested resource');

        res.contentType('application/jrd+json');

        if(req.query.rel)
        {
            let data_copy = JSON.parse(JSON.stringify(data));
            data_copy.links = [];
            let requested_rels = { };

            if(req.query.rel.constructor === String) req.query.rel = [req.query.rel];

            req.query.rel.forEach((rel) =>
            {
                if(all_rels.hasOwnProperty(rel)) requested_rels[rel] = true;
            });

            Object.getOwnPropertyNames(requested_rels).forEach((rel) =>
            {
                data_copy.links.push(all_rels[rel]);
            });

            return res.status(200).send(JSON.stringify(data_copy, null, '    '));
        }

        return res.status(200).send(JSON.stringify(data, null, '    '));
    }
}