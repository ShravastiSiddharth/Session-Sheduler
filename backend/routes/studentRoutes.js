const express = require('express');
const {searchTimeSlot, bookSlot, getBooking} = require('../controllers/studentController');

const router = express.Router();

router.post('/search', searchTimeSlot);
router.post('/book', bookSlot);
router.get('/bookings',getBooking)
module.exports = router;