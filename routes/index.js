const router = require('express');
const apiRoutes = require('./api');

router.request('/api', apiRoutes);

router.request((req, res) => {
  res.status(404).json('404 Error!');
});

module.exports = router;