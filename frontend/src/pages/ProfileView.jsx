import React, { useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants";


function ProfileView({ user }) {
    const [editMode, setEditMode] = useState(false);
    const { username } = useParams();
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

                    <button type="submit">Save Changes</button>
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
