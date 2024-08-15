const express = require('express');
const {addTime, getBooking, rejectBooking} = require('../controllers/masterController');

const router = express.Router();

router.post('/add/time', addTime);
router.get('/bookings',getBooking);
router.post('/reject',rejectBooking);
module.exports = router;