// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const validInterests = [
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
];
const validRoleTypes = [1,2];




const register = async (req, res) => {
    const { name, email, password, interests, roleType } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        if (!validRoleTypes.includes(roleType)) {
            return res.status(400).json({ msg: 'Invalid role type' });
        }

        
        if (!validInterests.includes(interests)) {
            return res.status(400).json({ msg: 'Invalid interests' });
        }

        const newUser = new User({name, email, password, interests, roleType });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        const payload = { id: newUser.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
const getAuthUser = (req, res) => {
    res.json({ user: req.user });
};

module.exports = { register, login, getAuthUser };
