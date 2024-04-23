import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import '../styles/Form.css';
import "../styles/ProfileCompletion.css";
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
        availableTime: '',
        location: '',
        rateType: '',
        rate: '',
        company_name: '',
        industry: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [stage, setStage] = useState(1); 
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

        if (stage === 1) {
            setStage(2);  // Move to the next form stage and wait for more form fileds
            setLoading(false);
            return;  // Exit the function early
        }

        const endpoint = role === 'worker' ? `/api/worker-profile/${username}/` : `/api/employer-profile/${username}/`;
        let formData;

        if (role === 'worker') {
            formData = new FormData();
            formData.append('first_name', profileData.firstName);
            formData.append('last_name', profileData.lastName);
            formData.append('phone_number', profileData.phoneNumber);
            formData.append('email', profileData.email);
            formData.append('available_time', profileData.availableTime);
            formData.append('location', profileData.location);
            formData.append('rate_type', profileData.rateType);
            formData.append('rate', profileData.rate.toString());
            if (profileData.picture) {
                formData.append('picture', profileData.picture);
            }
        } else {
            formData = JSON.stringify({
                profile: {
                    phone_number: profileData.phoneNumber,
                    user: {
                        first_name: profileData.firstName,
                        last_name: profileData.lastName,
                        email: profileData.email
                    }
                },
                company_name: profileData.company_name,
                industry: profileData.industry,
                description: profileData.description
            });
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

    const [totalSteps, setTotalSteps] = useState(role === 'worker' ? 3 : role === 'employer' ? 3 : 4);

    const stepLabels = [
        "Personal Info",
        "Additional Info",
        "Confirmation"
    ];

    return (
    <div className="profile-completion-container">
        <form onSubmit={handleSubmit} className="completion-form-container" encType={role === 'worker' ? "multipart/form-data" : undefined}>
            <div className="form-stepper">
                {[...Array(totalSteps)].map((_, index) => (
                    <>
                        <div className={`form-stepper-step ${index + 1 === stage ? 'active-step' : ''}`}>
                            {index + 1}
                        </div>
                        {index < totalSteps - 1 && <div className="form-stepper-line"></div>}
                    </>
                ))}
            </div>
            <div className="step-labels">
                {[...Array(totalSteps)].map((_, index) => (
                    <div key={index} className="step-label">
                        {stepLabels[index]} 
                    </div>
                ))}
            </div>

            {stage === 1 && (
                <>
                    <h1 className="prof-complete-title">You're almost done!</h1>
                    <h2 className='prof-complete-sub'>Please fill out the required information to complete the registration process</h2>
                    <div className="name-container">
                        <input className="prof-complete-input" type="text" name="firstName" value={profileData.firstName} onChange={updateField} placeholder="First Name" />
                        <input className="prof-complete-input" type="text" name="lastName" value={profileData.lastName} onChange={updateField} placeholder="Last Name" />
                    </div>
                    <input className="prof-complete-input" type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={updateField} placeholder="Phone Number" />
                    <input className="prof-complete-input" type="email" name="email" value={profileData.email} onChange={updateField} placeholder="Email" />
                    {role === 'worker' && (
                        <div>
                            <h3 className="prof-pic-text">Add a profile picture for others to know who you are</h3>
                            <input className="pfp-file" type="file" name="picture" onChange={updateField} />
                        </div>
                    )}
                    <button type="button" onClick={() => setStage(2)} className="next-button">Next</button>
                </>
            )}
            
            {stage === 2 && role === 'worker' && (
                <>
                    <h1 className="prof-complete-title">One last step!</h1>
                    <h2 className='prof-complete-sub'>Fill out the last fields to complete your profile</h2>
                    <input className="prof-complete-input" type="text" name="availableTime" value={profileData.availableTime} onChange={updateField} placeholder="Available Time" />
                    <input className="prof-complete-input" type="text" name="location" value={profileData.location} onChange={updateField} placeholder="Location" />
                    <div className="rate-container">
                            <input className="prof-complete-input" type="number" name="rate" value={profileData.rate} onChange={updateField} placeholder="Pay Rate" />
                            <select
                                name="rate_type"
                                value={profileData.rateType}
                                onChange={updateField}
                                className="prof-complete-input"
                            >
                                <option value="fixed">Fixed</option>
                                <option value="per_hour">Per Hour</option>
                                <option value="negotiable">Negotiable</option>
                            </select>
                    </div>
                    <div className='button-container'>
                        <button type="button" onClick={() => setStage(1)} className="back-button">Back</button>
                        <button type="button" onClick={() => setStage(3)} className="next-button">Next</button>
                    </div>
                </>
            )}

            {stage === 2 && role === 'employer' && (
                <>
                    <h1 className="prof-complete-title">One last step!</h1>
                    <h2 className='prof-complete-sub'>Fill out the last fields to complete your profile</h2>
                    <input className="prof-complete-input" type="text" name="company_name" value={profileData.company_name} onChange={updateField} placeholder="Company Name" />
                    <input className="prof-complete-input" type="text" name="industry" value={profileData.industry} onChange={updateField} placeholder="Industry" />
                    <textarea className="prof-complete-input" name="description" value={profileData.description} onChange={updateField} placeholder="Description"></textarea>
                    <div className='button-container'>
                        <button type="button" onClick={() => setStage(1)} className="back-button">Back</button>
                        <button type="button" onClick={() => setStage(3)} className="next-button">Next</button>
                    </div>
                </>
            )}

            {stage === 3 && (
                <>
                <h1 className="prof-complete-title">Thank you!</h1>
                <h2 className='prof-complete-sub'>Complete your profile or go back to make changes</h2>
                <div className='button-container'>
                        <button type="button" onClick={() => setStage(2)} className="back-button">Back</button>
                        <button type="submit" className="next-button">Complete Profile</button>
                    </div>
                </>
            )}

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
