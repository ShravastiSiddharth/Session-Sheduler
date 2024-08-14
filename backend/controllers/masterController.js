const mongoose = require('mongoose');
const User = require('../models/User');
const Master= require('../models/Master');
const Booking = require('../models/Bookings');

const addTime = async (req, res)=>{

    const {availableTimes} = req.body;

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    if(req.user.roleType!=1) return res.status(401).json({msg:'Not Valid User'});

    const mentor_id = req.user.id;
    try{
        let mentor = await Master.findOne({mentor_id });

        if (!mentor) {
            mentor = new Master({ mentor_id, availableTimes });
        } else {
            mentor.availableTimes.push(...availableTimes);
        }

        
        await mentor.save();

        return res.status(200).json({ msg: 'Available times added successfully', mentor });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};


const getBooking = async (req, res) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    if (req.user.roleType != 1) return res.status(401).json({ msg: 'Not Valid User' });

    const mentor_id = req.user.id;

    try {
      
        const bookings = await Booking.find({ mentor_id: mentor_id })
            .populate('mentor_id', 'name') 
            .populate('student_id', 'name');

        if (bookings.length === 0) {
            return res.status(404).json({ msg: 'No bookings found for this mentor' });
        }

       
        const formattedBookings = bookings.map(booking => ({
            ...booking.toObject(),
            studentName: booking.student_id.name, 
            mentorName: booking.mentor_id.name 
        }));

        res.json(formattedBookings);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};


module.exports = {addTime, getBooking};