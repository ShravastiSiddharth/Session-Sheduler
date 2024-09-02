import { React, useState, useEffect } from 'react'
import { useAuth } from '../../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ShowBookings.module.css'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash}  from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';


const Bookings = () => {

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
            const response = await axios.get('https://session-sheduler.onrender.com/api/master/bookings', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setbookings(response.data);
            setError(null)
           

        } catch (error) {
            setError('Error fetching bookings');
            console.error('Error fetching tasks:', error);
        }
    };


    const handleDelete = async (bookingId, slotId) => {
        try {
            // Make API call to reject the booking
            await axios.post('https://session-sheduler.onrender.com/api/master/reject', {
                bookId: bookingId
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Remove the deleted booking from state
            setbookings(bookings.filter(booking => booking._id !== bookingId));
            Swal.fire('Success','Slot deleted successfully!','success')
        } catch (error) {
            setError('Error rejecting the booking');
            console.error('Error rejecting the booking:', error);
        }
    };


    const confirmSwal = async (Id,slotId) => {
       

        Swal.fire({
            title: 'Are you sure you want to delete this slot?',                  
           confirmButtonText: 'Confirm',
            showCancelButton: true,
            cancelButtonText: 'Cancel',        
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(Id, slotId);
            }
        });
    };
    const filteredBookings = bookings.filter(booking => !booking.rejected);
    return (
        <>
            <div className={styles.heading}><span>Your Session Bookings</span></div>

            {error && <p className="error">{error}</p>}

            <div className={styles.slotCardDiv}>

                {filteredBookings.length > 0 ? (

                    <div className={styles.slotCardDiv}>
                      
{console.log(bookings)}
                        {filteredBookings.map((booking) => (
                            
                            booking.timeSlot.map((slot) => (

                               
                                <div className={styles.slotCard} key={booking._id + '-' + slot._id}>
                                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                                    <span>
                                        <span className={styles.startTime}> {new Date(slot.startTime).toLocaleTimeString()}</span>
                                        <span> &#160;to&#160; </span>
                                        <span className={styles.endTime}>{new Date(slot.endTime).toLocaleTimeString()}</span>

                                    </span>
                                    <span>{booking.duration} Min</span>
                                    <span>{booking.studentName}</span>
                                    <button className={styles.joinButton}>Join</button>
                                    <FontAwesomeIcon icon={faTrash} style={{cursor:'pointer'}}   onClick={() => confirmSwal(booking._id, slot._id)}/>
                                </div>
                                
                            ))
                        ))}
                    </div>

                ) : (
                    <p>No bookings available.</p>
                )}
            </div>

        </>

    )
}

export default Bookings