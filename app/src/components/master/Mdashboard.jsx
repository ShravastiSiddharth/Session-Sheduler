import {React, useEffect} from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../../authentication/AuthContext'
import { useNavigate } from 'react-router-dom'





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
    <h1>Master</h1>
    <Sidebar/>
    </>
  )
}

export default Mdashboard
