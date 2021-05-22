const router = require('express').Router();

router.get('/', (req, res) => {
    res.redirect('/productos');
})

module.exports = router;