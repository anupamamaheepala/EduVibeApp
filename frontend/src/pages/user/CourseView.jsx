import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/user/view-course.css';
import { AuthContext } from '../AuthContext';

const ViewCourse = () => {
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
            navigate('/my-courses');
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

  if (!course && !message) {
    return <div className="viewcourse-view-course-page">Loading...</div>;
  }

  return (
    <div className="viewcourse-view-course-page">
      <div className="viewcourse-view-course-semi-header">
        <div className="viewcourse-view-course-search-container">
          <h2>{course?.name || 'Course'}</h2>
          <button
            className="viewcourse-view-course-back-btn"
            onClick={() => navigate('/dashboard/mycourses')}
          >
            Back to My Courses
          </button>
        </div>
      </div>
      <div className="viewcourse-view-course-section">
        {message && (
          <p className={`viewcourse-view-course-feedback ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        {course && (
          <div className="course-details" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="chapters-list">
              {course.chapters && course.chapters.length > 0 ? (
                course.chapters.map((chapter, index) => (
                  <div key={index} className="viewcourse-course-card">
                    <div className="viewcourse-chapter-item">
                      <div
                        className="viewcourse-chapter-title"
                        onClick={() => toggleChapter(index)}
                      >
                        <span>{expandedChapters[index] ? '▼' : '▶'}</span>
                        {`${index + 1}. ${chapter.title || `Chapter ${index + 1}`}`}
                      </div>
                      {expandedChapters[index] && (
                        <div className={`viewcourse-chapter-description ${expandedChapters[index] ? 'active' : ''}`}>
                          {chapter.description || 'No description available'}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="viewcourse-view-course-no-chapters">No chapters available for this course.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourse;