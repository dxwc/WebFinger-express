let router = require('express').Router();

router.get('/', (req, res) =>
{
    res.render('home.ejs');
});

router.get('/user', async (req, res) =>
{
    try
    {
        if(!req.query.q) res.status(400).json({});
        let activitystream = await require('../get.js')
        .activitystream(req.query.q, req.query.domain);
        return res.json(activitystream);
    }
    catch(err)
    {
        console.error(err);
        return res.status(500).json({});
    }
});

module.exports = router;