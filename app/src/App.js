import './App.css';
import React from 'react';
import { AuthProvider } from './authentication/AuthContext';
import Login from './components/Login';
import SignUp from './components/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoleBasedRoute from './authentication/RoleBasedRoute';
import Mdashboard from './components/master/Mdashboard';
import Sdashboard from './components/student/Sdashboard';
import AddSlot from './components/master/AddSlot';
import ShowBookings from './components/student/ShowBookings';
import SearchTime from './components/student/SearchTime';


function App() {
  return (

    <Router>

      <AuthProvider>

        <Routes>

          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<SignUp/>} />

          <Route path='/mentor' element={<RoleBasedRoute allowedRoles={[1]}> 
            <Mdashboard/>
          </RoleBasedRoute>}/>
          <Route path='/addslot' element={<RoleBasedRoute allowedRoles={[1]}>
            <AddSlot/>
          </RoleBasedRoute>}/>

          <Route path='/dashboard' element={<RoleBasedRoute allowedRoles={[2]}>
            <Sdashboard/>
          </RoleBasedRoute>}/>
          <Route path='/slot' element={<RoleBasedRoute allowedRoles={[2]}>
            <SearchTime/>
          </RoleBasedRoute>}/>

        </Routes>

      </AuthProvider>

    </Router>

  );
}

export default App;
