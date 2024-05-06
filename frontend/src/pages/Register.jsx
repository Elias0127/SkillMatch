import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Form.css";
import LoadingIndicator from "../components/LoadingIndicator";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
//import PasswordChecklist from "react-password-checklist";
import validator from 'validator'

function RegistrationForm() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "worker",  // Default role
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateField = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.username) tempErrors.username = "Username is required";
        if (!formData.password) tempErrors.password = "Password is required";
        //new way of validating password to meet certain requirements 
        // to be strong
        if(!validator.isStrongPassword(formData.password, { 
            minLength: 8, minLowercase: 1, 
            minUppercase: 1, minNumbers: 1, minSymbols: 1 
        })){ 
            tempErrors.password = "Password is not strong.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // validate username 
    // check to see if username contains 0-9, 
    // uppercase and lowercase letters, 
    // length between 6- 20 characters
    /*
    const isValidUsername = /^[0-9A-Za-z]{6,20}$/;
    
    function validateUsername(){
        if (isValidUsername.test(formData.username)) {
            alert('Username is not unique.')
            return
          }

    }
    */

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const res = await api.post("/api/register/", formData);
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            console.log(formData.role)
            navigate(`/profile-complete/${formData.role}/${formData.username}`);
        } catch (error) {
            console.error("Registration error:", error.response ? error.response.data : error);
            setErrors({ form: error.response?.data.message || "An error occurred" });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="registration-container">
            <h1 className='title'>SkillMatch</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <h1 className="signup-title">Sign up</h1>
                <input
                    className="form-input"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={updateField}
                    placeholder="Username"
                />
                {/* 
                <PasswordChecklist
				rules={["minLength"]}
				minLength={8}
				value={formData.username}
				onChange={(isValid) => {}}
                messages={{
					minLength: "Username is not unique."
				}}
                />
                */}
                <input
                    className="form-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={updateField}
                    placeholder="Password"
                />
                {/* 
                <PasswordChecklist
				rules={["minLength","specialChar","number","capital"]}
				minLength={8}
				value={formData.password}
				onChange={() => validate()}
                messages={{
					minLength: "Password length must have minimum length of 8 characters.",
					specialChar: "Password must contain as least 1 special character.",
					number: "Password must contain as least 1 numerical value.",
					capital: "Password must contain as least 1 capitialized letter.",
				}}
                />
                */}
                <select
                    name="role"
                    value={formData.role}
                    onChange={updateField}
                    className="form-input"
                >
                    <option value="worker">Worker</option>
                    <option value="employer">Employer</option>
                </select>
                {Object.values(errors).map((error, index) => (
                    error && <p key={index} className="error">{error}</p>
                ))}
                {loading && <LoadingIndicator />}
                <button type="submit" className="form-button">Sign up</button>
            </form>
            <p className="text-center">Already have an account? 
                <button onClick={handleRegisterRedirect} className="link-button">
                    Log in
                </button>
            </p>
        </div>
    );
}

export default RegistrationForm;
