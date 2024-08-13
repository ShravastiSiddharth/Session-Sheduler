import {React, useEffect} from 'react'
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/AuthContext';

const Sdashboard = () => {
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
   <h1>Student</h1>
   <Sidebar/>
   </>
  )
}

export default Sdashboard