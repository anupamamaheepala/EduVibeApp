import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Swal from 'sweetalert2';
import Header from '../UserHeader';
import '../../css/user/learning-plans.css';

const LearningPlans = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to view your learning plans.',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    const fetchLearningPlans = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/courses/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch learning plans');
        }

        const data = await response.json();
        // Filter courses that have progress (i.e., the user has started them)
        const startedCourses = data.filter(course => course.progress);
        setCourses(startedCourses);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLearningPlans();
  }, [isLoggedIn, userId, navigate]);

  return (
    <div className="learningplan-learning-plans-page">
      <Header />
      <div className="learningplan-semi-header">
        <div className="learningplan-search-container">
          <h2>Your Learning Plans</h2>
        </div>
      </div>
      <div className="learningplan-courses-section">
        <div className="learningplan-courses-grid">
          {loading ? (
            <p>Loading learning plans...</p>
          ) : error ? (
            <p className="error">Error: {error}</p>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="learningplan-course-card">
                
                <div className="learningplan-course-content">
                  <h3>{course.name}</h3>
                  <p className="learningplan-course-author">By {course.username}</p>
                  <p className="learningplan-course-description">{course.description}</p>
                  <div className="learningplan-course-meta">
                    <span>{course.chapters ? course.chapters.length : 0} Chapters</span>
                  </div>
                </div>
                <div className="learningplan-course-actions">
                  <button
                    className="learningplan-continue-btn"
                    onClick={() => navigate(`/dashboard/course-chapters/${course.id}`)}
                  >
                    Continue Course
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="learningplan-no-courses">No courses in your learning plan yet. Start a course to add it here!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlans;