const express = require('express');
const {addTime, getBooking} = require('../controllers/masterController');

const router = express.Router();

router.post('/add/time', addTime);
router.get('/bookings',getBooking);
module.exports = router;