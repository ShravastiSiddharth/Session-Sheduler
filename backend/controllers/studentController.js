const mongoose = require('mongoose');
const User = require('../models/User');
const Master = require('../models/Master');
const Booking = require('../models/Bookings');

const searchTimeSlot = async (req, res) => {
    const { date, duration } = req.body;

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    if (req.user.roleType != 2) return res.status(401).json({ msg: 'Not Valid User' });

    try {
        const user = await User.findById(req.user._id).select('interests');

        if (!user) return res.status(404).json({ msg: 'User not found' });

        const interest = user.interests;

        const mentors = await User.find({ roleType: 1 })
            .populate({
                path: '_id',
                match: { interests: interest }
            });


        const results = [];


        for (let mentor of mentors) {
            const mentorId = mentor._id;


            const master = await Master.findOne({ mentor_id: mentorId });

            if (master) {

                const availableTimes = master.availableTimes.filter(timeSlot => {
                    return (
                        timeSlot.date.toDateString() === new Date(date).toDateString() &&
                        timeSlot.avDuration >= duration
                    );
                });


                if (availableTimes.length > 0) {
                    results.push({
                        mentor: mentorId,
                        availableTimes
                    });
                }
            }
        }
        return res.status(200).json({ date, interest, duration, mentors: results })
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};


const bookSlot = async (req, res) => {

    const { mentor_id, date, endTime, duration, preffered } = req.body;

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    if (req.user.roleType != 2) return res.status(401).json({ msg: 'Not Valid User' });

    try {

        const mentor = await User.findById(mentor_id);
        if (!mentor) return res.status(404).json({ msg: 'Mentor not found' });

        const master = await Master.findOne({ mentor_id: mentor_id });
        if (!master) return res.status(404).json({ msg: 'This mentor has not added Time Slots yet' });

        const slot = master.availableTimes.find(slot => 
            slot.date.toDateString() === new Date(date).toDateString() &&
            slot.startTime < new Date(endTime) &&
            slot.endTime >= new Date(endTime) &&
            slot.avDuration >= duration
        );

        if (!slot) return res.status(400).json({ msg: 'No available slot found for the given parameters' });


        const startTime = slot.bookingEnd ? new Date(slot.bookingEnd) : new Date(slot.startTime);
        const endTimeDate = new Date(endTime);

        const actualDuration = (endTimeDate - startTime) / (1000 * 60); // Duration in minutes

        if (actualDuration !== duration) {
            return res.status(400).json({ msg: 'Duration does not match the time difference between startTime and endTime' });
        }
        slot.avDuration -= duration;
        slot.bookingEnd = endTimeDate;


      
        await master.save();


        const booking = new Booking({
            mentor_id,
            student_id: req.user._id,
            date: new Date(date),
            timeSlot: [{
                startTime: startTime,
                endTime: endTimeDate
            }],
            duration,
            preffered
        });

        
        await booking.save();

        return res.status(200).json({ msg: 'Slot booked successfully', booking });

    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }



};

module.exports = { searchTimeSlot, bookSlot }