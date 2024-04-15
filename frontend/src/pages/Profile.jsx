import * as React from "react";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EProfile(){
    const [profile, setProfile] = useState({
        firstName:'',
        lastName: '',
        phoneNum: '',
        email: '',
        location: ''
    });
    const navigate = useNavigate();

    return (
        <div className="employer-profile-container">
                <form onSubmit={}>
                    <div>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={profile.firstName}
                            onChange={}
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={profile.lastName}
                            onChange={}
                        />
                    </div>
                    <div>
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNum"
                            value={profile.phoneNum}
                            onChange={}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={}
                        />
                    </div>
                    <div>
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={profile.location}
                            onChange={}
                        />
                    </div>
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        );
}

export default EProfile;


