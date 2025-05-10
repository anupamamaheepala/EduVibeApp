import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../css/about.css';

const About = () => {
  const teamMembers = [
    {
      name: "Anupama Maheepala",
      role: "Founder & Lead Educator",
      bio: "Former university professor with 15+ years of experience in education technology."
    },
    {
      name: "Himansa Pieris",
      role: "Head of Content",
      bio: "Curriculum development specialist passionate about engaging learning experiences."
    },
    {
      name: "Rashini de Silva",
      role: "Lead Developer",
      bio: "Full-stack developer focused on creating intuitive educational platforms."
    },
    {
      name: "Sadith Amarasinha",
      role: "Lead Developer",
      bio: "Full-stack developer focused on creating intuitive educational platforms."
    }
  ];

  return (
    <div className="about-page">
      <Header />
      
      <main className="about-content">
        <section className="about-hero">
          <div className="hero-content">
            <h1>About <span className="highlight">EduVibe</span></h1>
            <p className="tagline">Your trusted partner in online education and skill development.</p>
            <div className="purple-divider"></div>
          </div>
        </section>

        <section className="about-section mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <div className="purple-accent"></div>
            <p>
              At EduVibe, our mission is to make high-quality education accessible to everyone, 
              everywhere. We provide a platform for students and professionals to learn, grow, and 
              succeed in their careers through innovative teaching methods and cutting-edge technology.
            </p>
          </div>
          <div className="section-image mission-image">
            <div className="image-placeholder"></div>
          </div>
        </section>

        <section className="about-section features-section">
          <h2>Why Choose Us?</h2>
          <div className="purple-accent center"></div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Expert Instructors</h3>
              <p>Learn from industry professionals with real-world experience.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🖥️</div>
              <h3>Interactive Learning</h3>
              <p>Engage with dynamic content designed for better retention.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Skill Development</h3>
              <p>Build practical skills that employers are looking for.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community-Driven</h3>
              <p>Join a network of learners and share knowledge together.</p>
            </div>
          </div>
        </section>

        <section className="about-section team-section">
          <h2>Meet the Team</h2>
          <div className="purple-accent center"></div>
          <p className="team-intro">
            EduVibe is built by a passionate team of educators, developers, and designers
            who believe in the transformative power of knowledge.
          </p>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-avatar"></div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="about-section cta-section">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of students already unlocking their potential with EduVibe.</p>
            <button className="cta-button">Explore Courses</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;