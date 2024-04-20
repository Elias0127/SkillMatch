import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout'; 

const Header = () => {
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
            <Logout />
        </div>
    );
}

export default Home;
