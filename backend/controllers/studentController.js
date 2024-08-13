const mongoose = require('mongoose');
const User = require('../models/User');
const Master = require('../models/Master');

const searchTimeSlot = async (req, res) => {

    const { date, duration } = req.body;

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    if (req.user.roleType != 2) return res.status(401).json({ msg: 'Not Valid User' });

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

        // Find the mentor's master record
        const master = await Master.findOne({ mentor_id: mentorId });

        if (master) {
            // Filter available times
            const availableTimes = master.availableTimes.filter(timeSlot => {
                return (
                    timeSlot.date.toDateString() === new Date(date).toDateString() &&
                    timeSlot.avDuration >= duration
                );
            });

            // If there are available times, add the mentor and their times to results
            if (availableTimes.length > 0) {
                results.push({
                    mentor: mentorId,
                    availableTimes
                });
            }
        }
    }
    return res.status(200).json({ date, interest, duration, mentors:results })
};


module.exports = { searchTimeSlot }