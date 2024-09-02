import React, { useState, useEffect } from 'react';
import { useAuth } from '../../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import styles from '../../styles/SearchTime.module.css';
import Sidebar from './Sidebar';

const SearchTime = () => {
    const { isAuthenticated} = useAuth();
    const navigate = useNavigate();

    
    const [formData, setFormData] = useState({
        date: '',
        duration: 30,
    });
    const [preferred, setPreferred] = useState('no');
    const [availableMentors, setAvailableMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePreferredChange = (e) => {
        setPreferred(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://13.126.238.11:5000/api/student/search', formData);
            setAvailableMentors(response.data.mentors);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.msg || 'An error occurred. Please try again.', 'error');
        }
    };

    const calculateCost = (duration, preferred) => {
        const baseRates = { 30: 250, 45: 350, 60: 600 };
        let cost = baseRates[duration];
        if (preferred === 'yes') {
            cost += 150;
        }
        return cost;
    };

  
    const generateInvoice = () => {
        const doc = new jsPDF();
        doc.text('CareerCarve Session Booking Invoice', 10, 10);
        if (selectedMentor && selectedSlot) {
            doc.text(`Mentor: ${selectedMentor.name}`, 10, 20);
            doc.text(`Date: ${new Date(formData.date).toLocaleDateString()}`, 10, 30);
            doc.text(`Start Time: ${new Date(selectedSlot.startTime).toLocaleTimeString()}`, 10, 40);
            doc.text(`End Time: ${new Date(selectedSlot.endTime).toLocaleTimeString()}`, 10, 50);
            doc.text(`Duration: ${formData.duration} Min`, 10, 60);
            doc.text(`Cost: &#8377; ${calculateCost(formData.duration, preferred)} `, 10, 70);
            doc.text('Status: Pending', 10, 80);
        }
        doc.save('invoice.pdf');
    };
  

    const showSlotDetails = async (mentor, slot, slotStartTime, slotEndTime) => {
        setSelectedMentor(mentor);
        setSelectedSlot(slot);
       
        const startTime = new Date(slotStartTime).toLocaleTimeString();
        const endTime = new Date(slotEndTime).toLocaleTimeString();
        const date = new Date(slot.date).toLocaleDateString();
        const cost = calculateCost(formData.duration, preferred);

        Swal.fire({
            title: 'Slot Details',
            html: `
                <p><strong>Mentor Name:</strong> ${mentor.name}</p>
                <p><strong>Date:</strong> ${formData.date}</p>
                <p><strong>Start Time:</strong> ${startTime}</p>
                <p><strong>End Time:</strong> ${endTime}</p>
                <p><strong>Duration:</strong> ${formData.duration} Min</p>
                <p><strong>Price:</strong> &#8377; ${cost} </p>
            `,
          
            confirmButtonText: 'Confirm',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                // Update the state in preConfirm

                // Return a value to make sure the Swal promise resolves
                return true;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleBook(mentor, slot, slotStartTime, slotEndTime);
            }
        });
    };

    const handleBook = async (mentor, slotStartTime, slotEndTime, slot,) => {



        if (!mentor || !slot) {
            Swal.fire('Error', 'No mentor or slot selected. Please try again.', 'error');
            return;
        }

        // const endTime = new Date(new Date(slot.startTime).getTime() + formData.duration * 60000);


        const bookingData = {
            mentor_id: mentor.id,
            date: formData.date,
            endTime: new Date(slotEndTime),
            duration: formData.duration,
            preferred: preferred === 'yes'
        };
      
        try {
            await axios.post('http://13.126.238.11:5000/api/student/book', bookingData);
            Swal.fire('Success', 'Slot booked successfully', 'success');
            generateInvoice();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.msg || 'An error occurred. Please try again.', 'error');
        }
    };

    return (
        <div className={styles.dashboard}>
            <div>
                <Sidebar />
            </div>
            <div style={{ padding: '2rem' }}>
                <div className={styles.headingDiv}>Book your 1x1 Session now!</div>
                <div className={styles.formBoxDiv}>
                    <form onSubmit={handleSearch} className={styles.form}>
                        <div>
                            <label htmlFor="date">Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                                className={styles.formInput}
                            />
                        </div>
                        <div>
                            <label htmlFor="duration">Duration :</label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className={styles.formInput}
                            >
                                <option value={30}>30 Min</option>
                                <option value={45}>45 Min</option>
                                <option value={60}>60 Min</option>
                            </select>
                        </div>
                        <div>
                            <div> <label>Do you want to select mentor of your choice?</label></div>
                            <div style={{ padding: '0.5rem' }}>
                                <label>
                                    <input
                                        type="radio"
                                        name="preferred"
                                        value="yes"
                                        checked={preferred === 'yes'}
                                        onChange={handlePreferredChange}
                                        className={styles.radioInput}
                                    />
                                    Yes
                                </label>
                                <label >
                                    <input
                                        type="radio"
                                        name="preferred"
                                        value="no"
                                        checked={preferred === 'no'}
                                        onChange={handlePreferredChange}
                                        className={styles.radioInput}
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        <button type="submit">Search</button>
                    </form>

                    {availableMentors.length > 0 && (
                        <div>
                            <h3>Available Slots</h3>
                            <div className={styles.timeSlotCardDiv}>
                                {preferred === 'no' ? (
                                    availableMentors.map((mentor) => (
                                        <div key={mentor.mentor.id}>
                                            {/* <h4>Mentor: {mentor.mentor.name}</h4> */}
                                            {mentor.availableTimes.map((slot) => {

                                                const slotStartTime = slot.bookingEnd ? new Date(slot.bookingEnd) : new Date(slot.startTime);
                                                const slotEndTime = new Date(slotStartTime.getTime() + formData.duration * 60000);
                                                return (
                                                    <div key={slot._id}>
                                                        <div className={styles.slotDiv}>
                                                            <div>
                                                                <p> Start Time: {slotStartTime.toLocaleTimeString()}</p>
                                                                <p> End Time: {new Date(slotEndTime).toLocaleTimeString()}</p>
                                                            </div>
                                                            <div>
                                                                <button onClick={() => showSlotDetails(mentor.mentor, slotStartTime, slotEndTime, slot)} className={styles.bookbtn}>
                                                                    Book Slot
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))
                                )

                                    : (
                                        availableMentors.map((mentor) => (
                                            <div key={mentor.mentor.id} className={styles.mentorDiv}>
                                                <h4>Mentor: {mentor.mentor.name}</h4>
                                                <p >
                                                    <span >⭐</span>
                                                    <span >⭐</span>
                                                    <span >⭐</span>
                                                    <span >⭐</span>
                                                    <span style={{ color: 'grey' }}>⭐</span>
                                                  <span>  (10 ratings)</span>
                                                </p>

                                                {mentor.availableTimes.map((slot) => {

                                                    const slotStartTime = slot.bookingEnd ? new Date(slot.bookingEnd) : new Date(slot.startTime);
                                                    const slotEndTime = new Date(slotStartTime.getTime() + formData.duration * 60000);

                                                    return (
                                                        <div key={slot._id}>
                                                            <p>
                                                                Slot: <span> {slotStartTime.toLocaleTimeString()}</span> - <span>{slotEndTime.toLocaleTimeString()}</span>
                                                            </p>
                                                            <button className={styles.bookMentor} onClick={() => showSlotDetails(mentor.mentor, slotStartTime, slotEndTime, slot)}>
                                                                Select Mentor
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))
                                    )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchTime;



