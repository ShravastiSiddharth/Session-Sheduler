import { React, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/AuthContext';
import styles from '../../styles/Dashboard.module.css'
import SearchTime from './SearchTime';
import ShowBookings from './ShowBookings';

const Sdashboard = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else if (user) {
            setLoading(false);
        }
    }, [isAuthenticated, navigate, user]);


    if (loading) {
        return <div>Loading...</div>; 
    }


    return (
        <>
            <div className={styles.dashboard}>

                <div>
                    <Sidebar />
                </div>

                <div>
                    <div className={styles.welcomeDiv}> <span>Welcome, {user.name || 'Student'}!</span></div>
                    <div>
                       <ShowBookings/>
                    </div>

                </div>
            </div>


            {/* <div>
   
    <SearchTime/>
    <ShowBookings/>
    </div> */}

        </>
    )
}

export default Sdashboard