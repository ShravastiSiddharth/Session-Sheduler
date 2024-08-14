import {React, useState, useEffect} from 'react'
import { useAuth } from '../../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


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
            const response = await axios.get('http://localhost:5000/api/master/bookings', {
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
     <div className="bookings-container">
            <h1>Bookings</h1>
            {error && <p className="error">{error}</p>}
            {bookings.length > 0 ? (
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration (mins)</th>
                            <th>Student Name</th>
                            <th>Mentor Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            booking.timeSlot.map((slot) => (
                                <tr key={booking._id + '-' + slot._id}>
                                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                                    <td>{new Date(slot.startTime).toLocaleTimeString()}</td>
                                    <td>{new Date(slot.endTime).toLocaleTimeString()}</td>
                                    <td>{booking.duration}</td>
                                    <td>{booking.studentName}</td>
                                    <td>{booking.mentorName}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No bookings available.</p>
            )}
        </div>
   
    </>

  )
}

export default Bookings