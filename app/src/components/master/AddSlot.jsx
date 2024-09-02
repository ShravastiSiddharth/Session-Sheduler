import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/SearchTime.module.css';
import Sidebar from './Sidebar';
import Swal from 'sweetalert2';

const AddSlot = () => {



    const { isAuthenticated ,user} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } 
    }, [isAuthenticated, navigate,user]);

  


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
           
            await axios.post('http://13.126.238.11:5000/api/master/add/time', { availableTimes }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            Swal.fire('Success', 'Slot Added successfully', 'success');
            setSuccess('Time slot added successfully!');
            setDate('');
            setStartTime('');
            setEndTime('');
            setError('');
        } catch (error) {
            setError('Error adding time slot.');
            console.error('Error adding time slot:', error);
            Swal.fire('Error',`${error}`,'error')
        }
    };

    const errorSwal =(error)=>{
        Swal.fire('Error',`${error}`,'error');
    }

    return (
        <>
            <div className={styles.dashboard}>
                <div>
                    <Sidebar />
                </div>
                <div style={{ padding: '2rem' }}>
                    <div className={styles.headingDiv}>Add your available timings</div>
                    <div className={styles.formBoxDiv}>
                        <form onSubmit={handleSubmit} className={styles.form}>
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
                    </div>
                   
                    {error && errorSwal(error)}
                   
                </div>
            </div>
        </>
    );
};

export default AddSlot;
