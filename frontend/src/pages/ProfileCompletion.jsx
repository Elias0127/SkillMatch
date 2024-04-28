import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import '../styles/Form.css';
import "../styles/ProfileCompletion.css";
import { ACCESS_TOKEN } from "../constants";

function ProfileCompletionForm() {
    const { username, role } = useParams();
    const navigate = useNavigate();

    const totalSteps = role === 'worker' ? 4 : 3;
    const stepLabels = [
        "Personal Info",
        "Additional Info",
        role === 'worker' ? "Skill Details" : "Company Details",
        "Confirmation"
    ].slice(0, totalSteps);

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        picture: null,
        availableTime: '',
        location: '',
        rateType: 'fixed',
        rate: '',
        company_name: '',
        industry: '',
        description: ''
    });

    const [newSkill, setNewSkill] = useState({ name: '', level: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [stage, setStage] = useState(1);

    useEffect(() => {
        // Clear errors when stage changes
        setErrors({});
    }, [stage]);

    const updateField = e => {
        const { name, type, value, files } = e.target;
        setProfileData(prev => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
    };

    const validateFields = (fields) => {
        const newErrors = {};
        fields.forEach(field => {
            if (!profileData[field]) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
            }
        });
        if (role === 'worker' && !profileData.picture && fields.includes('picture')) {
            newErrors.picture = 'Picture is required for workers';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            switch (stage) {
                case 1:
                case 2:
                    const requiredFields = stage === 1 ? ['firstName', 'lastName', 'phoneNumber', 'email'] : ['availableTime', 'location', 'rate', 'rateType'];
                    if (validateFields(requiredFields)) {
                        setStage(stage + 1);
                    }
                    break;
                case 3:
                    if (role === 'worker') {
                        const skillAddedSuccessfully = await handleAddSkill();
                        if (skillAddedSuccessfully) {
                            setStage(4);
                        }
                    } else {
                        finalizeProfile();
                    }
                    break;
                default:
                    finalizeProfile();
                    break;
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setErrors({ form: error.message || "An error occurred during form submission" });
        }
        setLoading(false);
    };

    const handleAddSkill = async () => {
        if (!newSkill.name || !newSkill.level || !newSkill.description) {
            setErrors({ skillForm: 'Please fill in all fields for skills' });
            return false;
        }
        try {
            const response = await api.post(`/api/worker-skills/${username}/`, { skill: newSkill }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                }
            });
            if (response.status === 200 || response.status === 201) {
                setNewSkill({ name: '', level: '', description: '' });
                return true;
            } else {
                // Handle non-200 status codes
                const errorMessage = response.statusText || 'Failed to add skill';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Skill addition error:', error);
            setErrors({ skillForm: error.message || 'Failed to add skill' });
            return false;
        }
    };

    const finalizeProfile = async () => {
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
            console.log('User role:', response.data.role);
            navigate(`/dashboard/${username}/${role}`);
        } catch (error) {
            console.error('Profile completion error:', error);
            setErrors({ form: error.message || "An error occurred during profile completion" });
        }
    };


    const handleNext = async () => {
        setErrors({}); // Clear previous errors
        try {
            switch (stage) {
                case 1:
                    const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'email'];
                    if (!validateFields(requiredFields)) return;
                    if (role === 'worker' && !profileData.picture) {
                        throw new Error('Picture is required for workers');
                    }
                    break;
                case 2:
                    const additionalRequiredFields = role === 'worker' ? ['availableTime', 'location', 'rate', 'rateType'] : ['company_name', 'industry', 'description'];
                    if (!validateFields(additionalRequiredFields)) return;
                    break;
                case 3:
                    if (role === 'worker') {
                        const skillAddedSuccessfully = await handleAddSkill();
                        if (!skillAddedSuccessfully) return;
                        break;
                    }
                    break;
                default:
                    break;
            }
            if (stage < totalSteps) {
                setStage(prevStage => prevStage + 1);
            }
        } catch (error) {
            console.error('Next stage error:', error);
            setErrors({ form: error.message || "An error occurred while proceeding to the next stage" });
        }
    };

    return (
        <div className="profile-completion-container">
            <form onSubmit={handleSubmit} className="completion-form-container" encType={role === 'worker' ? "multipart/form-data" : undefined}>
                <div className="form-stepper">
                    {[...Array(totalSteps)].map((_, index) => (
                        <React.Fragment key={index}>
                            <div className={`form-stepper-step ${index + 1 === stage ? 'active-step' : ''}`}>
                                {index + 1}
                            </div>
                            {index < totalSteps - 1 && <div className="form-stepper-line"></div>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="step-labels">
                    {stepLabels.map((label, index) => (
                        <div key={index} className="step-label">
                            {label}
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
                        <button type="button" onClick={() => handleNext(2)} className="next-button">Next</button>
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
                            <select name="rateType" value={profileData.rateType} onChange={updateField} className="prof-complete-input">
                                <option value="fixed">Fixed</option>
                                <option value="per_hour">Per Hour</option>
                                <option value="negotiable">Negotiable</option>
                            </select>
                        </div>
                        <div className='button-container'>
                            <button type="button" onClick={() => setStage(1)} className="back-button">Back</button>
                            <button type="button" onClick={() => handleNext(3)} className="next-button">Next</button>
                        </div>
                    </>
                )}

                {stage === 3 && role === 'worker' && (
                    <>
                        <h1 className="prof-complete-title">Add Your Skills</h1>
                        <h2 className='prof-complete-sub'>Enter details about your skills</h2>
                        <input className="prof-complete-input" type="text" value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="Skill Name" />
                        <input className="prof-complete-input" type="text" value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })} placeholder="Skill Level" />
                        <input className="prof-complete-input" type="text" value={newSkill.description} onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })} placeholder="Skill Description" />
                        <div className='button-container'>
                            <button type="button" onClick={() => setStage(2)} className="back-button">Back to Profile Info</button>
                            <button type="button" onClick={() => handleNext()} className="next-button">Add Skill and Continue</button>
                        </div>
                    </>
                )}

                {stage === 4 && role === 'worker' && (
                <>
                    <h1 className="prof-complete-title">Thank you!</h1>
                    <h2 className='prof-complete-sub'>Complete your profile or go back to make changes</h2>
                    <div className='button-container'>
                        <button type="button" onClick={() => setStage(3)} className="back-button">Go Back and Edit Skills</button>
                        <button type="submit" className="next-button">Complete Profile</button>
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
                            <button type="button" onClick={() => handleNext(3)} className="next-button">Next</button>
                        </div>
                    </>
                )}

                {stage === 3 && role === 'employer' && (
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
