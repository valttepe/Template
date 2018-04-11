const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('users');
  // res.send('respond with a resource');
});

module.exports = router;
