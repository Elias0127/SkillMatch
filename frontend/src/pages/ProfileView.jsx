import React, { useState } from 'react';
import api from '../api';

function ProfileView({ user }) {
    const [editMode, setEditMode] = useState(false);
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
            }
        };
        try {
            const { data } = await api.put(`/api/worker-profile/${user.username}/`, formData, config);
            setEditMode(false);
            setFormData({
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
                phone_number: data.phone_number,
                picture: data.picture,
                availableTime: data.available_time,
                location: data.location,
                rate: data.rate,
                companyName: data.company_name,
                industry: data.industry,
                description: data.description
            });
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    if (!user) return <div>No user data found.</div>;

    return (
        <div>
            <h2>Profile</h2>
            {editMode ? (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />
                    <input type="text" name="picture" value={formData.picture} onChange={handleChange} placeholder="Picture" />
                    <input type="text" name="availableTime" value={formData.availableTime} onChange={handleChange} placeholder="Available Time" />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
                    <input type="text" name="rate" value={formData.rate} onChange={handleChange} placeholder="Rate" />

                    <button type="submit">Save</button>
                </form>
            ) : (
                <div>
                    <p>Name: {formData.firstName} {formData.lastName}</p>
                    <p>Email: {formData.email}</p>
                    <p>Phone Number: {formData.phone_number}</p>
                    <p>Picture: {formData.picture}</p>
                    <p>Available Time: {formData.availableTime}</p>
                    <p>Location: {formData.location}</p>
                    <p>Rate: {formData.rate}</p>
                    <button onClick={() => setEditMode(true)}>Edit</button>
                </div>
            )}
        </div>
    );
}
export default ProfileView;
