import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddSlot = () => {



    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else {
           // fetchBookings();
        }
    }, [isAuthenticated, navigate]);



    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date || !startTime || !endTime) {
            setError('All fields are required.');
            return;
        }

       
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        const duration = Math.floor((end - start) / (1000 * 60)); 

        if (duration <= 0) {
            setError('End time must be after start time.');
            return;
        }

        const availableTimes = [{
            date: `${date}T00:00:00.000Z`,
            startTime: `${date}T${startTime}:00.000Z`,
            endTime: `${date}T${endTime}:00.000Z`,
            avDuration: duration
        }];

        try {
            console.log(availableTimes)
            await axios.post('http://localhost:5000/api/master/add/time', { availableTimes }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess('Time slot added successfully!');
            setDate('');
            setStartTime('');
            setEndTime('');
            setError('');
        } catch (error) {
            setError('Error adding time slot.');
            console.error('Error adding time slot:', error);
        }
    };

    return (
        <div className="add-slot-container">
            <h1>Add Time Slot</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Start Time:</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>End Time:</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
                <button type="submit">Add Slot</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default AddSlot;
