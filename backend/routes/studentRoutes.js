const express = require('express');
const {searchTimeSlot} = require('../controllers/studentController');

const router = express.Router();

router.post('/search', searchTimeSlot);
module.exports = router;