import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../AuthContext';
import '../../css/courses/view-all-course.css';

const ViewAllCourse = () => {
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [expandedChapters, setExpandedChapters] = useState({});
  const { isLoggedIn } = useContext(AuthContext);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to view the course.',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/${courseId}`, {
          headers: { 'X-User-Id': userId },
        });

        setCourse(response.data.course);
        setMessage('');
      } catch (error) {
        const errorMessage =
          error.response?.status === 401
            ? 'Session expired. Please log in again.'
            : error.response?.status === 404
            ? 'Course not found.'
            : error.response?.data?.message || 'Failed to fetch course. Please try again.';

        setMessage(`Error: ${errorMessage}`);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        }).then(() => {
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            navigate('/login');
          } else {
            navigate('/courses');
          }
        });
      }
    };

    fetchCourse();
  }, [isLoggedIn, userId, courseId, navigate]);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleStartCourse = async () => {
    try {
      await axios.post(`http://localhost:8000/api/courses/${courseId}/start`, {}, {
        headers: { 'X-User-Id': userId },
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Course started successfully!',
      }).then(() => {
        navigate('/dashboard'); // Redirect to dashboard or a learning page after starting
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to start course. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  if (!course && !message) {
    return <div className="view-all-course-page">Loading...</div>;
  }

  return (
    <div className="view-all-course-page">
      <div className="view-all-course-header">
        <div className="view-all-course-header-container">
          <h2>{course?.name || 'Course'}</h2>
          <button className="view-all-course-back-btn" onClick={() => navigate('/courses')}>
            Back to Courses
          </button>
        </div>
      </div>
      <div className="view-all-course-content-section">
        {message && (
          <p className={`view-all-course-feedback ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        {course && (
          <div className="view-all-course-card">
            <div className="view-all-course-title">{course.name}</div>
            <div className="view-all-course-chapter-item">
              <button
                className="view-all-course-start-btn"
                onClick={handleStartCourse}
              >
                Start Course
              </button>
            </div>
            <div className="chapters-list">
              {course.chapters && course.chapters.length > 0 ? (
                course.chapters.map((chapter, index) => (
                  <div key={index} className="view-all-course-chapter-item">
                    <div
                      className="view-all-course-chapter-title"
                      onClick={() => toggleChapter(index)}
                    >
                      <span>{expandedChapters[index] ? '▼' : '▶'}</span>
                      {`${index + 1}. ${chapter.title || `Chapter ${index + 1}`}`}
                    </div>
                    {expandedChapters[index] && (
                      <div className="view-all-course-chapter-description">
                        {chapter.description || 'No description available'}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="view-all-course-no-chapters">No chapters available for this course.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllCourse;