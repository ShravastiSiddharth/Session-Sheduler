import { React, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../../authentication/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/Dashboard.module.css'
import Bookings from './Bookings'





const Mdashboard = () => {

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
