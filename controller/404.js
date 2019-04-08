let router = require('express').Router();

router.all('*', (req, res) =>
{
    res.status(404).render('404.ejs');
});

module.exports = router;