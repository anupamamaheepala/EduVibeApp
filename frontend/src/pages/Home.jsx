import React, { useContext } from 'react';
import Header from './Header';
import UserHeader from './UserHeader';
import Footer from './Footer';
import '../css/home.css';
import { AuthContext } from './AuthContext';
import HomeImage from '../images/Home.jpeg';
const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="home-page">
      {isLoggedIn ? <UserHeader /> : <Header />}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Learn Without Limits</h1>
          <p>Discover courses taught by industry experts and expand your skills from anywhere, anytime.</p>
          <div className="hero-buttons">
            <button className="explore-btn">Explore Courses</button>
            <button className="learn-more-btn">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          
          <img src={HomeImage} alt="Description"/>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose EduLearn?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon expert"></div>
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals with real-world experience.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon flexible"></div>
            <h3>Flexible Learning</h3>
            <p>Study at your own pace with 24/7 access to course materials.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon certificate"></div>
            <h3>Certification</h3>
            <p>Earn recognized certificates to showcase your new skills.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon community"></div>
            <h3>Community</h3>
            <p>Join a global community of learners and instructors.</p>
          </div>
        </div>
      </div>

      <div className="popular-courses">
        <h2>Popular Learning Plan Topics</h2>
        <div className="course-grid">
          <div className="course-card">
            <div className="course-content">
              <span className="course-category">Development</span>
              <h3>Web Development</h3>
            </div>
          </div>
          <div className="course-card">
            <div className="course-content">
              <span className="course-category">Design</span>
              <h3>UI/UX Design Fundamentals</h3>
            </div>
          </div>
          <div className="course-card">
            <div className="course-content">
              <span className="course-category">Business</span>
              <h3>Digital Marketing Strategy</h3>
            </div>
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default Home;