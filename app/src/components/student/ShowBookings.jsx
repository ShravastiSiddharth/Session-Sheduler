import { React, useState, useEffect } from 'react'
import { useAuth } from '../../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/ShowBookings.module.css'

const ShowBookings = () => {
    
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setbookings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else {
            fetchBookings();
        }
    }, [isAuthenticated, navigate]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/student/bookings', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setbookings(response.data);
            setError(null)
            console.log(response.data);

        } catch (error) {
            setError('Error fetching bookings');
            console.error('Error fetching tasks:', error);
        }
    };
    return (
        <>

            <div className={styles.heading}><span>Your Session Slots</span></div>

            <div className={styles.slotCardDiv}>
                {bookings.map((booking) => (
                    booking.timeSlot.map((slot) => (
                        <div className={styles.slotCard} key={booking._id + '-' + slot._id}>

                            <span> <span>Date: </span>{new Date(booking.date).toLocaleDateString()}</span>

                            <span>
                                
                                <span>   {new Date(slot.startTime).toLocaleTimeString()} - </span>
                                <span> {new Date(slot.endTime).toLocaleTimeString()}</span>
                            </span>

                            <span>{booking.duration} Min</span>

                            <span>
                                <span> Mentor: </span>
                                <span>{booking.mentorName}</span>
                            </span>
                            {slot.rejected ? (
                                <button disabled className={styles.cancelledButton}>Cancelled</button>
                            ) : (
                                <button  className={styles.joinButton}>Join</button>
                            )}
                        </div>
                    ))
                ))}
            </div>

        </>

    )
}

export default ShowBookings
