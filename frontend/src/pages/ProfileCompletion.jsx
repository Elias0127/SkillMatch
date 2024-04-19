import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import '../styles/Form.css';
import "../styles/ProfileCompletion.css";
import LoadingIndicator from '../components/LoadingIndicator';

function ProfileCompletionForm() {
    const { username, role } = useParams();
    console.log(role)
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        picture: null,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const updateField = e => {
        if (e.target.type === 'file') {
            setProfileData({ ...profileData, picture: e.target.files[0] });
        } else {
            setProfileData({ ...profileData, [e.target.name]: e.target.value });
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!profileData.firstName) tempErrors.firstName = 'First name is required';
        if (!profileData.lastName) tempErrors.lastName = 'Last name is required';
        if (!profileData.phoneNumber) tempErrors.phoneNumber = 'Phone number is required';
        if (!profileData.email) tempErrors.email = 'Email is required';
        if (role === 'worker' && !profileData.picture) tempErrors.picture = 'Picture is required for workers';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        const endpoint = role === 'worker' ? `/api/worker-profile/${username}/` : `/api/employer-profile/${username}/`;

        try {
            const formData = new FormData();
            formData.append('firstName', profileData.firstName);
            formData.append('lastName', profileData.lastName);
            formData.append('phoneNumber', profileData.phoneNumber);
            formData.append('email', profileData.email);
            if (role === 'worker' && profileData.picture) {
                formData.append('picture', profileData.picture);
            }

            const res = await api.put(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/home'); 
        } catch (error) {
            console.error('Profile completion error:', error.response ? error.response.data : error);
            setErrors({ ...errors, form: error.response?.data.message || "An error occurred during profile completion" });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="profile-completion-container">
            <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data">
                <h1 className="prof-complete-title">You're almost done!</h1>
                <h2 className='prof-complete-sub'>Please fill out the required information to complete the registration process</h2>
                <input className="prof-complete-input" type="text" name="firstName" value={profileData.firstName} onChange={updateField} placeholder="First Name" />
                <input className="prof-complete-input" type="text" name="lastName" value={profileData.lastName} onChange={updateField} placeholder="Last Name" />
                <input className="prof-complete-input" type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={updateField} placeholder="Phone Number" />
                <input className="prof-complete-input" type="email" name="email" value={profileData.email} onChange={updateField} placeholder="Email" />
                <h3 className="prof-pic-text">Add a profile picture for others to know who you are</h3>
                {role === 'worker' && (
                    <input className="pfp-file" type="file" name="picture" onChange={updateField} />
                )}
                <button type="submit" className="form-button">Complete Profile</button>
                {loading && <LoadingIndicator />}
                {Object.values(errors).map((error, index) => (
                    <p key={index} className="error">{error}</p>
                ))}
            </form>
        </div>
    );
}

export default ProfileCompletionForm;
