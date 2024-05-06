import React, { useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import Logout from './Logout';
import SkillManagement from './SkillManagement';
import { ACCESS_TOKEN } from "../constants";
import '../styles/dashboard.css';
import HomePage from './Home';


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
                description: user.description || '',
                location: user.location || '',
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
            const { data } = await api.put(`/api/${role}-profile/${username}/`, submitFormData, config);
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
        <div className='dashboard-container'>
            <div className='profile'>
                <div className='profile-header'>
                    <div className='profile-text-container'>
                        <h1 className='header-logo'>SkillMatch</h1>
                    </div>
                </div>
                <div className='menu'> 
                    <a href="#" className={activeSection === 'home' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('home')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="20" height="20" className="back-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                        Home
                    </a>
                    <a href="#" className={activeSection === 'account' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('account')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="20" height="20" className="back-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                        Account</a>
                    {role === 'worker' && (
                        <a href="#" className={activeSection === 'skills' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('skills')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" width="20" height="20" stroke="currentColor" class="back-icon">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" /></svg>                      
                            Skills
                        </a>
                    )}
                    <a href="#" className={activeSection === 'password' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('password')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} width="20" height="20" stroke="currentColor" className="back-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                        Password
                    </a>
                    <a href="#" className={activeSection === 'contract' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('contract')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} width="20" height="20" stroke="currentColor" className="back-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                        Contract
                    </a>
                    <a href="#" className={activeSection === 'notification' ? 'menu-links active' : 'menu-links'} onClick={() => handleMenuClick('notification')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} width="20" height="20" stroke="currentColor" className="back-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
                        Notification
                    </a>
                    <a href="#"><Logout></Logout></a>

                </div>
            </div>

            <div className="main-container">
                {activeSection === 'home' && (
                    <div id="home-section" className="section">
                         <div className='account-header'>
                            <h2 className='account-title'>Hey, {formData.firstName}! </h2>
                            <p className='account-text'>This is your profile dashboard with all your information as a <span className='role-title'>{role}.</span></p>
                            <HomePage />
                        </div>
                    </div>                   
                )}



                {/* Account Section */}
                {activeSection === 'account' && (
                <>
                    <div id="account-section" className="account-section">
                        <div className='account-header'>
                            <h2 className='account-title'>Hey, {formData.firstName}! </h2>
                            <p className='account-text'>This is your profile dashboard with all your information as a <span className='role-title'>{role}.</span></p>
                        </div>
                        {editMode ? (
                            // Edit form with fields for both worker and employer
                            <form className="profile-form" onSubmit={handleSubmit}>
                                <div className='edit-container'>
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
                                </div>

                                {/* Fields specific to worker */}
                                {role === 'worker' && (
                                    <div className='edit-container'>
                                        <p className='specific-title'>These are specific fields for workers.</p>
                                        <div className='account-edit'>
                                            <div className='input-container'>
                                            <label>Picture</label>
                                                <input className='edit-fields' type="text" name="picture" value={formData.picture} onChange={handleChange} placeholder="Picture" />                       
                                            </div>
                                        </div>
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
                                    </div>
                                )}

                                {/* Fields specific to employer */}
                                {role === 'employer' && (
                                    <div className='edit-container'>
                                        <p className='specific-title'>These are specific fields for employers.</p>
                                        <div className='account-edit'>
                                            <div className='input-container'>
                                            <label>Company Name</label>
                                                <input className="edit-fields" type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />                       
                                            </div>
                                        </div>
                                        <div className='account-edit'>
                                            <div className='input-container'>
                                            <label>Industry</label>
                                                <input className="edit-fields" type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry" />                     
                                            </div>
                                        </div>
                                        <div className='account-edit'>
                                            <div className='input-container'>
                                            <label>Description</label>
                                                <input className='edit-fields' type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />                       
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button className='save-button'type="submit">Save Changes</button>
                            </form>
                        ) : (
                            // Display profile info with fields for both worker and employer
                            <div className="profile-info">
                                <div className='account-top'>
                                    <h2>Personal Information</h2>
                                    <button className='edit-button' onClick={() => setEditMode(true)}>Edit</button>
                                </div>
                                {role === 'worker' && (
                                    <>
                                        <img src={formData.picture} className="profile-image"/>
                                        <p className='prof-text'>Your current profile picture</p>
                                    </>
                                )}
                                <div className='name-email-container'>
                                    <p className="info-item"><span className="label">Name</span> {formData.firstName} {formData.lastName}</p>
                                </div>
                                <div className='name-email-container'>
                                    <p className="info-item"><span className="label">Email</span> {formData.email}</p>  
                                    <p className="info-item name-item"><span className="label">Phone Number</span> {formData.phone_number}</p>                                   
                                </div>

                                {/* Display fields specific to worker */}
                                {role === 'worker' && (
                                    <>
                                        <div className='name-email-container'>
                                            <p className="info-item"><span className="label">Available Time</span> {formData.availableTime}</p>
                                            <p className="info-item name-item"><span className="label">Location</span> {formData.location}</p>
                                            <p className="info-item name-item"><span className="label">Rate</span> {formData.rate}</p>
                                        </div>
                                    </>
                                )}

                                {/* Display fields specific to employer */}
                                {role === 'employer' && (
                                    <>
                                        <div className='name-email-container'>
                                            <p className="info-item"><span className="label">Company Name</span> {formData.companyName}</p>
                                            <p className="info-item name-item"><span className="label">Industry</span> {formData.industry}</p>
                                            <p className="info-item name-item"><span className="label">Description</span> {formData.description}</p>
                                            <p className="info-item name-item"><span className="label">Location</span> {formData.location}</p>
                                        </div>
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
                            <p className='account-text'>This is where you can manage all your skills as a <span className='role-title'>{role}</span>.</p>
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
