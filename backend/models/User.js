const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roleType:{
        type:Number,
        enum:[1,2],
        required: true,
    },
    interests:{
        type:String,
        required:true,
        enum: [
            'FMCG Sales',
            'Equity Research',
            'Digital Marketing',
            'Product Management',
            'Financial Analysis',
            'Market Research',
            'Operations Management',
            'Business Development',
            'Data Analytics',
            'Human Resources',
            'Project Management',
            'Supply Chain Management'
        ]
    }   
},
{timestamps:true}
);

module.exports = mongoose.model('User', UserSchema);
