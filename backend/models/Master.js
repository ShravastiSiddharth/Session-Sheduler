const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
    mentor_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    stars: { 
        type: Number, 
        min: 0, 
        max: 5, 
    },
    votes: { 
        type: Number, 
        default: 0 
    },
    availableTimes: [{
        date:{type:Date},
        startTime:{type:Date},
        endTime:{type:Date},
        avDuration:{type:Number},
        bookingEnd:{type:Date,default:null}
    }]
},
{timestamps:true});



module.exports = mongoose.model('Mentor', MentorSchema);
