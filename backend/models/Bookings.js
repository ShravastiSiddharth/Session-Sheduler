const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    mentor_id :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    student_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    date:{
        type: Date,
        require:true,
    },
    timeSlot:[{
        starTime:{type:Date,require:true},
        endTime:{type:Date,require:true}
    }],
    duration:{
        type:Number,
        require:true
    },
    preffered:{
        type:Boolean,
        default:false,
    }
},
{timestamps:true});

module.exports = mongoose.model('Booking',BookingSchema);