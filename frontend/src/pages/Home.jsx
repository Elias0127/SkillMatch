import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout'; 

const header = () => {
        return (
          <header className="header">
            <nav className="nav-bar">
              <Link to="/" className="nav-item">Skillmatch</Link>
              <Link to="/about" className="nav-item">About</Link>
              <Link to="/discover" className="nav-item">Discover</Link>
              <Link to="/review" className="nav-item">Review</Link>
              <Link to="/login" className="nav-item nav-button">Log In</Link>
              <Link to="/signup" className="nav-item nav-button sign-up">Sign Up</Link>
            </nav>
          </header>
        );
};

const HeroSection = () => {
return (
    <section className="hero-section">
    <h1>Your local service needs</h1>
    <Link to="/discover" className="discover-button">Discover</Link>
    </section>
    );
};

function Home() {
    return (
        <div>
            <h1>Welcome to the Local Services Market</h1>
            <p>This is your dashboard where you can manage your services or requests.</p>
            <Logout />
        </div>
    );
}

export default Home;
