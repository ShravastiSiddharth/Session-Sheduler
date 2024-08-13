const express = require('express');
const {searchTimeSlot, bookSlot} = require('../controllers/studentController');

const router = express.Router();

router.post('/search', searchTimeSlot);
router.post('/book', bookSlot);
module.exports = router;