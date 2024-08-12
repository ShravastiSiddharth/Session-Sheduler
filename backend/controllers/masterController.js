const mongoose = require('mongoose');
const User = require('../models/User');
const Master= require('../models/Master');

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


module.exports = {addTime}