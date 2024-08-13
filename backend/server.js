
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const masterRoutes = require('./routes/masterRoutes');
const studentRoutes = require('./routes/studentRoutes');
const {ensureAuth} = require('./middleware/authMiddleware');

//const authRoutes = require('./')

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/master', ensureAuth, masterRoutes);
app.use('/api/student', ensureAuth, studentRoutes);


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(
    () => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch(err => console.error(err));
