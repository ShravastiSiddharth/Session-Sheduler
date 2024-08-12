const express = require('express');
const {addTime} = require('../controllers/masterController');

const router = express.Router();

router.post('/add/time', addTime);
module.exports = router;