module.exports = (data) =>
{
    // REQUIRED:
    // data.host <url>:<port> of the deployed site
    // data.resource
    // data.links
    // and each item in links, ther must be a rel
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
        let data_copy = data;
        if(req.rel)
        {
            let rel;
            let selected_links = [];
            if(req.rel.constructor === String) rel = [req.rel];
            else rel = req.rel;

            for(let i = 0; i < data.links.length; ++i)
            {
                for(let k = 0; k < rel.length; ++k)
                {
                    if(data.links.rel[i] === rel[k])
                    {
                        selected_links.push(data.links[i]);
                        break;
                    }
                }
            }

            data_copy.links = selected_links;
        }
        return res.status(200).send(JSON.stringify(data_copy));
    }
}