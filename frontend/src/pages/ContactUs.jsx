import React, { useState, useContext } from 'react';
import '../css/ContactUs.css'; // Import your CSS file for styling
import Header from './Header';
import UserHeader from './UserHeader';
import Footer from './Footer';
import { AuthContext } from './AuthContext';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { name, email, subject, message } = formData;

    // Basic validation
    if (!name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (!subject.trim()) {
      setError('Subject is required');
      setLoading(false);
      return;
    }
    if (!message.trim()) {
      setError('Message is required');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call (replace with actual endpoint if available)
      // Example: await axios.post('http://localhost:8000/api/contact', formData);
      setTimeout(() => {
        setSuccess('Your message has been sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to send your message. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
    {isLoggedIn ? <UserHeader /> : <Header />}
    <div className="contact-container">
      <h2 className="contact-title">Contact Us</h2>
      {error && <div className="contact-error">{error}</div>}
      {success && <div className="contact-success">{success}</div>}
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-group">
          <label htmlFor="name" className="contact-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="contact-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            disabled={loading}
          />
        </div>
        <div className="contact-form-group">
          <label htmlFor="email" className="contact-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="contact-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
        <div className="contact-form-group">
          <label htmlFor="subject" className="contact-label">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="contact-input"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter the subject"
            disabled={loading}
          />
        </div>
        <div className="contact-form-group">
          <label htmlFor="message" className="contact-label">Message</label>
          <textarea
            id="message"
            name="message"
            className="contact-textarea"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            rows="5"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="contact-submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
    <Footer />
    </div>
  );
};

export default ContactUs;