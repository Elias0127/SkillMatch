import React, { useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import Logout from './Logout';
import SkillManagement from './SkillManagement';
import { ACCESS_TOKEN } from "../constants";
import '../styles/dashboard.css';


function ProfileView({ user }) {
    const [editMode, setEditMode] = useState(false);
    const { username, role } = useParams();
    // console.log("Username from params:", username);

    const [formData, setFormData] = useState({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        picture: user.picture || '',
        availableTime: user.available_time || '',
        location: user.location || '',
        rate: user.rate || '',
        companyName: user.company_name || '', 
        industry: user.industry || '',
        description: user.description || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        console.log("Form Data being sent:", formData);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username) {
            console.error('Username is undefined, cannot update profile.');
            return; 
        }

        const submitFormData = new FormData();
        submitFormData.append('first_name', formData.firstName);
        submitFormData.append('last_name', formData.lastName);
        submitFormData.append('email', formData.email);
        submitFormData.append('phone_number', formData.phone_number);
        submitFormData.append('available_time', formData.availableTime);
        submitFormData.append('location', formData.location);
        submitFormData.append('rate', formData.rate);  
        submitFormData.append('company_name', formData.companyName);
        submitFormData.append('industry', formData.industry);
        submitFormData.append('description', formData.description);

        if (typeof formData.picture === 'object') {  
            submitFormData.append('picture', formData.picture, formData.picture.name);
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                'Content-Type': 'multipart/form-data'  
            }
        };

        try {
            const { data } = await api.put(`/api/worker-profile/${username}/`, submitFormData, config);
            setEditMode(false);
            console.log('Successfully updated profile:', data);
            setFormData({ 
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
                phone_number: data.phone_number,
                picture: data.picture_url || data.picture, 
                availableTime: data.available_time,
                location: data.location,
                rate: data.rate.toString(), 
                companyName: data.company_name,
                industry: data.industry,
                description: data.description
            });
        } catch (error) {
            console.error('Failed to update profile:', error);
            if (error.response) {
                console.log('Error details:', error.response.data);
            }
        }
    };

    return (
        <>
        <div className="profile-container">
            <div className='profile-header'>
                <h2>Information</h2> 
                <button className='edit-button' onClick={() => setEditMode(true)}>Edit</button>
            </div>
            <h2 className='role-header'>Role: <span className='role-title'>{role}</span></h2>
            {editMode ? (
                <form className="profile-form" onSubmit={handleSubmit}>
                    <label className="form-group">
                        First Name
                        <input className='edit-fields' type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                    </label>
                    <label className="form-group">
                        Last Name
                        <input className='edit-fields' type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                    </label>
                    <label className="form-group">
                        Email
                        <input className='edit-fields' type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    </label>
                    <label className="form-group">
                        Phone Number
                        <input className='edit-fields' type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />
                    </label>
                    <label className="form-group">
                        Picture
                        <input className='edit-fields' type="text" name="picture" value={formData.picture} onChange={handleChange} placeholder="Picture" />
                    </label>
                    <label className="form-group">
                        Available Time
                        <input className='edit-fields' type="text" name="availableTime" value={formData.availableTime} onChange={handleChange} placeholder="Available Time" />
                    </label>
                    <label className="form-group">
                        Location
                        <input className='edit-fields' type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                    </label>
                    <label className="form-group">
                        Rate
                        <input className='edit-fields' type="text" name="rate" value={formData.rate} onChange={handleChange} placeholder="Rate" />
                    </label>

                    {role === 'employer' && (
                        <div>
                            <label className="form-group">
                                Company Name
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
                            </label>
                            <label className="form-group">
                                Industry
                                <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry" />
                            </label>
                            <label className="form-group">
                                Description
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                            </label>
                        </div>
                    )}

                    <button className='save-button'type="submit">Save Changes</button>
                </form>
            ) : (
            <div className="profile-info">
                <p className="info-item"><span className="label">Name</span> {formData.firstName} {formData.lastName}</p>
                <p className="info-item"><span className="label">Email</span> {formData.email}</p>
                <p className="info-item"><span className="label">Phone Number</span> {formData.phone_number}</p>
                <p className="info-item"><span className="label">Picture</span> {formData.picture}</p>
                <p className="info-item"><span className="label">Available Time</span> {formData.availableTime}</p>
                <p className="info-item"><span className="label">Location</span> {formData.location}</p>
                <p className="info-item"><span className="label">Rate</span> {formData.rate}</p>

                {role === 'employer' && (
                    <div>
                        <p className="info-item"><span className="label">Company Name</span> {formData.companyName}</p>
                        <p className="info-item"><span className="label">Industry</span> {formData.industry}</p>
                        <p className="info-item"><span className="label">Description</span> {formData.description}</p>
                    </div>
                )}
            </div>
            )}
            <Logout />
        </div>
        <div className='skill-container'>
            {role === 'worker' && <SkillManagement username={username} />}
        </div>
        </>
    );
}
export default ProfileView;
