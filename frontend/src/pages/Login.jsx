import React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from "../components/Form";

function LoginPage() {
    const navigate = useNavigate();
    const fields = [
        { name: 'username', type: 'text', placeholder: 'Username' },
        { name: 'password', type: 'password', placeholder: 'Password' }
    ];

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <h1 className='title'>SkillMatch</h1>
            <Form route="/api/login/" method="Login" fields={fields} />
            <p className="text-center">Don't have an account? 
                <button onClick={handleRegisterRedirect} className="link-button">
                    Sign up
                </button>
            </p>
        </div>
    );
}

export default LoginPage;
