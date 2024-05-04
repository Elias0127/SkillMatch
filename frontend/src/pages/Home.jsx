import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Home.css";
import mainImage from "../assets/Chatbot.png";
import Logout from './Logout'; 

const Header = () => {
        return (
            <div className="header">
            <nav className="nav-bar">
                <div className="left-section">
                    <Link to="/Home" className="nav-item">Skillmatch</Link>
                    <Link to="/about" className="nav-item">About</Link>
                    <Link to="/discover" className="nav-item">Discover</Link>
                    <Link to="/review" className="nav-item">Review</Link>
                </div>
                <div className="right-section">
                    <div className="auth-buttons">
                        <Link to="/login" className="nav-button">Log In</Link>
                        <Link to="/register" className="nav-button sign-up">Sign Up</Link>
                    </div>
                </div>
            </nav>
        </div>
        
        );
};

const HeroSection = () => {
return (
    <section className="hero-section">
        <div className='hero-content'>
            <h1>Your local service needs</h1>
            <Link to="/discover" className="discover-button">Discover</Link>
        </div>
        <div className='hero-image'>
            <img src={mainImage} alt='main-image' />
        </div>
    </section>
    );
};

const ServicesSection = () => {
    return (
      <section className="services-section">
        <h2>Available services</h2>
        <div className="services-list">
          <div className="service-item">Plumbing</div>
          <div className="service-item">Electrician</div>
          <div className="service-item">Mechanic</div>
        </div>
      </section>
    );
  };

function Home() {
    return (
        <div className='home-container'>
            <Header />
            <HeroSection />
            <ServicesSection />
        </div>
    );
}

export default Home;
