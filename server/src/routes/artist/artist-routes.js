const express = require('express');
const views = require('./artist');
const router = express.Router();

router.get("/", views.test)

module.exports = router;