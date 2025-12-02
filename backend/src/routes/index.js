// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name: "SkillWise API",
    version: "1.0.0",
    message: "API Root",
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/goals', require('./goals'));
router.use('/challenges', require('./challenges'));
router.use('/progress', require('./progress'));
router.use('/submissions', require('./submissions'));
router.use('/ai', require('./ai'));
router.use('/reviews', require('./reviews'));
router.use('/leaderboard', require('./leaderboard'));

module.exports = router;
