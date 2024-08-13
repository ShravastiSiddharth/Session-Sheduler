import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../authentication/AuthContext';
import styles from '../styles/Signup.module.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'


const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        interests: '',
        roleType: '' 
    });

    const interestsOptions = [
        'FMCG Sales',
        'Equity Research',
        'Digital Marketing',
        'Product Management',
        'Financial Analysis',
        'Market Research',
        'Operations Management',
        'Business Development',
        'Data Analytics',
        'Human Resources',
        'Project Management',
        'Supply Chain Management'
    ];

    const roleOptions = [
        { value: 1, label: 'Mentor' },
        { value: 2, label: 'Student' }
    ];

    const [errors, setErrors] = useState({});
    const { login } = useAuth();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) errors.name = 'Name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        if (!formData.interests) errors.interests = 'Interests are required';
        if (!formData.roleType) errors.roleType = 'Role type is required';

        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const dataToSend = {
            ...formData,
            roleType: Number(formData.roleType)
        };
        try {
            console.log(dataToSend)
            const response = await axios.post('http://localhost:5000/api/auth/register',dataToSend);
            login(response.data.token);
            await   Swal.fire({
                //position: "top-end",
                icon: "success",
                title: "Sign Up Succesful!",
                showConfirmButton: false,
                timer: 1000
              });
        } catch (error) {
            setErrors({ server: error.response?.data?.msg || 'An error occurred. Please try again.' });
        }
    };

    return (<>
        <div className={styles.signupCont}>
            <div className={styles.signupForm}>
                <h1>Welcome to <span >CareerCarve!</span></h1>
                <form onSubmit={onSubmit}>
                    <div className={styles.formGroup}>
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} />
                        {errors.name && <div className={styles.error}>{errors.name}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={onChange} />
                        {errors.email && <div className={styles.error}>{errors.email}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Role Type</label>
                        <select name="roleType" value={formData.roleType} onChange={onChange}>
                            <option value="">Select a role</option>
                            {roleOptions.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {errors.roleType && <div className={styles.error}>{errors.roleType}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Interests</label>
                        <select name="interests" value={formData.interests} onChange={onChange}>
                            <option value="">Select an interest</option>
                            {interestsOptions.map((interest, index) => (
                                <option key={index} value={interest}>
                                    {interest}
                                </option>
                            ))}
                        </select>
                        {errors.interests && <div className={styles.error}>{errors.interests}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={onChange} />
                        {errors.password && <div className={styles.error}>{errors.password}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} />
                        {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}
                    </div>
                    {errors.server && <div className={styles.error}>{errors.server}</div>}
                    <button type="submit" className={styles.mybtn}>Sign Up</button>
                </form>
                <br/>
               
                <div>Already have an account? <Link to='/'>LogIn</Link></div>
            </div>
        </div>
    </>
    );
};

export default SignUp;
