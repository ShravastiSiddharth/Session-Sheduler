import { React, useEffect } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../../authentication/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/Dashboard.module.css'
import Bookings from './Bookings'





const Mdashboard = () => {

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {

    }
  }, [isAuthenticated, navigate]);

  return (
    <>

      <div className={styles.dashboard}>
        <div>
          <Sidebar />
        </div>
        <div>
          <h1>Welcome, Master!</h1>
          <div>
            <Bookings/>
          </div>

        </div>
      </div>
    </>
  )
}

export default Mdashboard
