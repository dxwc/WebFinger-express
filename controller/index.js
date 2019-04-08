let router = require('express').Router();

router.use(require('./home.js')); // last route
router.use(require('./404.js')); // last route

module.exports = router;