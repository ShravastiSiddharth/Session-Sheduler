import React, { useState, useEffect } from 'react';
import { useAuth } from '../../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import styles from '../../styles/SearchTime.module.css';
import Sidebar from './Sidebar';

const SearchTime = () => {
    const { isAuthenticated } = useAuth();
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
            const response = await axios.post('http://localhost:5000/api/student/search', formData);
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
        doc.text('Invoice', 10, 10);
        if (selectedMentor && selectedSlot) {
            doc.text(`Mentor: ${selectedMentor.name}`, 10, 20);
            doc.text(`Date: ${new Date(formData.date).toLocaleDateString()}`, 10, 30);
            doc.text(`Start Time: ${new Date(selectedSlot.startTime).toLocaleTimeString()}`, 10, 40);
            doc.text(`End Time: ${new Date(selectedSlot.endTime).toLocaleTimeString()}`, 10, 50);
            doc.text(`Duration: ${formData.duration} Min`, 10, 60);
            doc.text(`Cost: ${calculateCost(formData.duration, preferred)} RS`, 10, 70);
            doc.text('Status: Pending', 10, 80);
        }
        doc.save('invoice.pdf');
    };

    const showSlotDetails = async (mentor, slot,slotStartTime, slotEndTime) => {
        setSelectedMentor(mentor);
                setSelectedSlot(slot);
                console.log("slot end before swal",slotEndTime)
        const startTime = new Date(slotStartTime).toLocaleTimeString();
        const endTime = new Date(slotEndTime).toLocaleTimeString();
        const date = new Date(slot.date).toLocaleDateString();
        const cost = calculateCost(formData.duration, preferred);

        Swal.fire({
            title: 'Slot Details',
            html: `
                <p><strong>Mentor Name:</strong> ${mentor.name}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Start Time:</strong> ${startTime}</p>
                <p><strong>End Time:</strong> ${endTime}</p>
                <p><strong>Duration:</strong> ${formData.duration} Min</p>
                <p><strong>Price:</strong> ${cost} RS</p>
            `,
            icon: 'info',
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
                handleBook(mentor,slot,slotStartTime, slotEndTime);
            }
        });
    };

    const handleBook = async (mentor, slotStartTime, slotEndTime,slot,) => {
        
      

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
        console.log("end time",slotEndTime)
console.log(bookingData)
        try {
            await axios.post('http://localhost:5000/api/student/book', bookingData);
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
            <div>
                <h2>Search for Available Mentors</h2>
                <form onSubmit={handleSearch}>
                    <div>
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="duration">Duration (minutes):</label>
                        <select
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                        >
                            <option value={30}>30</option>
                            <option value={45}>45</option>
                            <option value={60}>60</option>
                        </select>
                    </div>
                    <div>
                        <label>Preferred:</label>
                        <label>
                            <input
                                type="radio"
                                name="preferred"
                                value="yes"
                                checked={preferred === 'yes'}
                                onChange={handlePreferredChange}
                            />
                            Yes, Show Mentor Profiles
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="preferred"
                                value="no"
                                checked={preferred === 'no'}
                                onChange={handlePreferredChange}
                            />
                            No, Show Time Slots Only
                        </label>
                    </div>
                    <button type="submit">Search</button>
                </form>

                {availableMentors.length > 0 && (
                    <div>
                        <h3>Available Mentors</h3>
                        {preferred === 'no' ? (
                            availableMentors.map((mentor) => (
                                <div key={mentor.mentor.id}>
                                    <h4>Mentor: {mentor.mentor.name}</h4>
                                    {mentor.availableTimes.map((slot) => {
                                      
                                       const slotStartTime = slot.bookingEnd ? new Date(slot.bookingEnd) : new Date(slot.startTime);
                                       const slotEndTime = new Date(slotStartTime.getTime() + formData.duration * 60000);
                                        return (
                                            <div key={slot._id}>
                                                <p>
                                                    Start Time: {slotStartTime.toLocaleTimeString()} | End Time: {new Date(slotEndTime).toLocaleTimeString()}
                                                </p>
                                                <button onClick={() => showSlotDetails(mentor.mentor, slotStartTime,slotEndTime,slot)}>
                                                    Book Slot
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        ) : (
                            availableMentors.map((mentor) => (
                                <div key={mentor.mentor.id}>
                                    <h4>Mentor: {mentor.mentor.name}</h4>
                                    <p>Rating: ★★★★☆ (10 ratings)</p>
                                    {mentor.availableTimes.map((slot) => {
                                          
                                           const slotStartTime = slot.bookingEnd ? new Date(slot.bookingEnd) : new Date(slot.startTime);
                                           const slotEndTime = new Date(slotStartTime.getTime() + formData.duration * 60000);

                                        return (
                                            <div key={slot._id}>
                                                <p>
                                                    Start Time: {slotStartTime.toLocaleTimeString()} | End Time: {slotEndTime.toLocaleTimeString()}
                                                </p>
                                                <button onClick={() => showSlotDetails(mentor.mentor,slotStartTime,slotEndTime,slot)}>
                                                    Select Mentor
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchTime;
