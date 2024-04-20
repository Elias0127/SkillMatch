import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import '../styles/Form.css';
import LoadingIndicator from '../components/LoadingIndicator';
import { ACCESS_TOKEN } from "../constants";


function ProfileCompletionForm() {
    const { username, role } = useParams();
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
            setProfileData(prevState => ({ ...prevState, picture: e.target.files[0] }));
        } else {
            setProfileData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
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

        let formData;
        if (role === 'worker') {
            formData = new FormData();
            formData.append('first_name', profileData.firstName);
            formData.append('last_name', profileData.lastName);
            formData.append('phone_number', profileData.phoneNumber);
            formData.append('email', profileData.email);
            if (profileData.picture) {
                formData.append('picture', profileData.picture);
            }
        } else {
            formData = {
                profile: {
                    phone_number: profileData.phoneNumber,
                    user: {
                        first_name: profileData.firstName,
                        last_name: profileData.lastName,
                        email: profileData.email
                    }
                }
            };
        }

        try {
            const response = await api.put(endpoint, formData, {
                headers: {
                    'Content-Type': role === 'worker' ? undefined : 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('Response data:', response.data);
            navigate('/home');
        } catch (error) {
            console.error('Profile completion error:', error);
            setErrors(prevErrors => ({ ...prevErrors, form: error.message || "An error occurred during profile completion" }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-completion-container">
            <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data">
                <h1>Complete Your Profile</h1>
                <input type="text" name="firstName" value={profileData.firstName} onChange={updateField} placeholder="First Name" />
                <input type="text" name="lastName" value={profileData.lastName} onChange={updateField} placeholder="Last Name" />
                <input type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={updateField} placeholder="Phone Number" />
                <input type="email" name="email" value={profileData.email} onChange={updateField} placeholder="Email" />
                {role === 'worker' && (
                    <input type="file" name="picture" onChange={updateField} />
                )}
                <button type="submit" className="form-button">Complete Profile</button>
                {loading && <p>Loading...</p>}
                {Object.keys(errors).length > 0 && (
                    <div>
                        {Object.values(errors).map((error, index) => (
                            <p key={index} className="error">{error}</p>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
}

export default ProfileCompletionForm;
