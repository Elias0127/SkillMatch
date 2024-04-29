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

    const [activeSection, setActiveSection] = useState('account');

    const handleMenuClick = (section) => {
        setActiveSection(section);
    };

    const getFormData = () => {
        if (role === 'worker') {
            return {
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                picture: user.picture || '',
                availableTime: user.available_time || '',
                location: user.location || '',
                rate: user.rate || '',
                rateType: user.rate_type || '', 
            };
        } else { 
            return {
                firstName: user.profile.user.first_name || '',
                lastName: user.profile.user.last_name || '',
                email: user.profile.user.email || '',
                phone_number: user.profile.phone_number || '',
                picture: user.profile.picture || '',
                companyName: user.company_name || '',
                industry: user.industry || '',
                description: user.description || ''
            };
        }
    };

    const [formData, setFormData] = useState(getFormData);

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

    const BackIcon = () => {
        return (
            <a href="/" className="home-link">
                <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <span className="home-text">Home</span>
            </a>
        )
    }

    return (
        <>
        <h1 className='dash-title'>Dashboard</h1>
        <div className='dashboard-container'>
            <div className='profile'>
                <div className='profile-header'>
                    <img src={formData.picture} className="profile-image" />
                    <div className='profile-text-container'>
                        <p className="profile-title"> {formData.firstName} {formData.lastName}</p>
                        <p className='profile-role'><span className='role-title'>{role.charAt(0).toUpperCase() + role.slice(1)} Profile</span></p>
                    </div>
                </div>
                <div className='menu'> 
                    <a href="/home" className='home-link'><BackIcon></BackIcon></a>

                    <a href="#" className={activeSection === 'account' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('account')}>Account</a>
                    {role === 'worker' && (
                        <a href="#" className={activeSection === 'skills' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('skills')}>Skills</a>
                    )}
                    <a href="#" className={activeSection === 'password' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('password')}>Password</a>
                    <a href="#" className={activeSection === 'contract' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('contract')}>Contract</a>
                    <a href="#" className={activeSection === 'notification' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('notification')}>Notification</a>
                    <a href="#" className={activeSection === 'logout' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('logout')}>Log out</a>
                </div>
            </div>

            <div className="main-container">
                {/* Account Section */}
                {activeSection === 'account' && (
                <>
                    <div id="account-section" className="section">
                        <div className='account-header'>
                            <h2 className='account-title'>Information</h2>
                            <button className='edit-button' onClick={() => setEditMode(true)}>Edit</button>
                        </div>
                        {editMode ? (
                            // Edit form with fields for both worker and employer
                            <form className="profile-form" onSubmit={handleSubmit}>

                                <div className='account-edit'>
                                    <div className='input-container'>
                                    <label>First Name</label>
                                        <input className='edit-fields' type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />                           
                                    </div>
                                    <div className='input-container'>
                                    <label>Last Name</label>
                                        <input className='edit-fields' type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />                           
                                    </div>
                                </div>

                                <div className='account-edit'>
                                    <div className='input-container'>
                                    <label>Email</label>
                                        <input className='edit-fields' type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />                           
                                    </div>
                                    <div className='input-container'>
                                    <label> Phone Number </label>
                                        <input className='edit-fields' type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />                        
                                    </div>
                                </div>

                                <div className='account-edit'>
                                    <div className='input-container'>
                                    <label>Picture</label>
                                        <input className='edit-fields' type="text" name="picture" value={formData.picture} onChange={handleChange} placeholder="Picture" />                       
                                    </div>
                                </div>

                                {/* Fields specific to worker */}
                                {role === 'worker' && (
                                    <>
                                    <div className='account-edit'>
                                        <div className='input-container'>
                                        <label>Available Time</label>
                                            <input className='edit-fields' type="text" name="availableTime" value={formData.availableTime} onChange={handleChange} placeholder="Available Time" />                      
                                        </div>
                                    </div>
                                    <div className='account-edit'>
                                        <div className='input-container'>
                                        <label>Location</label>
                                            <input className='edit-fields' type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />                      
                                        </div>
                                    </div>
                                    <div className='account-edit'>
                                        <div className='input-container'>
                                        <label>Rate</label>
                                            <input className='edit-fields' type="text" name="rate" value={formData.rate} onChange={handleChange} placeholder="Rate" />                       
                                        </div>
                                    </div>
                                    </>
                                )}

                                {/* Fields specific to employer */}
                                {role === 'employer' && (
                                    <div>
                                        <div className='input-container'>
                                        <label>Company Name</label>
                                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />                       
                                        </div>
                                        <div className='input-container'>
                                        <label>Industry</label>
                                            <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry" />                     
                                        </div>
                                        <div className='input-container'>
                                        <label>Description</label>
                                            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />                      
                                        </div>
                                    </div>
                                )}

                                <button className='save-button'type="submit">Save Changes</button>
                            </form>
                        ) : (
                            // Display profile info with fields for both worker and employer
                            <div className="profile-info">
                                <p className="info-item"><span className="label">Name</span> {formData.firstName} {formData.lastName}</p>
                                <p className="info-item"><span className="label">Email</span> {formData.email}</p>
                                <p className="info-item"><span className="label">Phone Number</span> {formData.phone_number}</p>

                                {/* Display fields specific to worker */}
                                {role === 'worker' && (
                                    <>
                                        <p className="info-item"><span className="label">Available Time</span> {formData.availableTime}</p>
                                        <p className="info-item"><span className="label">Location</span> {formData.location}</p>
                                        <p className="info-item"><span className="label">Rate</span> {formData.rate}</p>
                                    </>
                                )}

                                {/* Display fields specific to employer */}
                                {role === 'employer' && (
                                    <>
                                        <p className="info-item"><span className="label">Company Name</span> {formData.companyName}</p>
                                        <p className="info-item"><span className="label">Industry</span> {formData.industry}</p>
                                        <p className="info-item"><span className="label">Description</span> {formData.description}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </>
                )}

                {activeSection === 'skills' && (
                    <div id="skill-section" className="section">
                        <div className='account-header'>
                            <h2 className='account-title'>Skill Management</h2> 
                        </div>
                        <div className='skill-container'>
                        <SkillManagement username={username} />
                        </div>
                    </div>

                )}

                {/* Password Section */}
                {activeSection === 'password' && (
                    <div id="password-section" className="section">
                        <div className='account-header'>
                            <h2 className='account-title'>Password</h2> 
                        </div>
                    </div>
                )}
                
                {/* Contract Section */}
                {activeSection === 'contract' && (
                    <div id="contract-section" className="section">
                        <div className='account-header'>
                            <h2 className='account-title'>Contracts</h2> 
                        </div>
                    </div>
                )}

                {/* Notification Section */}
                {activeSection === 'notification' && (
                    <div id="notification-section" className="section">
                        <div className='account-header'>
                            <h2 className='account-title'>Notifications</h2> 
                        </div>
                    </div>
                )}

                {/* Logout Section */}
                {activeSection === 'logout' && (
                    <div id="logout-section" className="section">
                        <div className='account-header'>
                            <h2 className='account-title'>Log Out</h2> 
                        </div>
                        <Logout />
                    </div>
                )}

            </div>
        </div>
        </>
    );
}

export default ProfileView;
