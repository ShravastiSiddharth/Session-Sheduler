import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../authentication/AuthContext';
import styles from '../styles/Signup.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'


const Login = () => {
 
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   // const navigate = useNavigate();
    const validateForm = () => {
        const errors = {};
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {

            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
           const {user, token} =  response.data;
            login(token, user);
            
         await   Swal.fire({
                
                icon: "success",
                title: "Log In Succesful!",
                showConfirmButton: false,
                timer: 1000
              });
              if (user.roleType === 1) {
                navigate('/mentor');
            } else if (user.roleType === 2) {
                navigate('/dashboard'); 
            }
        } catch (error) {
            setErrors({ server: error.response?.data?.msg || 'An error occurred. Please try again.' });
        }
    };

    return (
        <div className={styles.signupCont}>
            <div className={styles.signupForm}>
                <h1>Welcome to <span >CareerCarve!</span></h1>
                <form onSubmit={onSubmit}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={onChange} />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={onChange} />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                    {errors.server && <div className="error">{errors.server}</div>}
                    <button className={styles.mybtn} type="submit">Login</button>
                </form>
                <br/>
               
               <div>Don't have an account? <Link to="/signup">SignUp</Link></div>
            </div>
        </div>
    );
};

export default Login;
