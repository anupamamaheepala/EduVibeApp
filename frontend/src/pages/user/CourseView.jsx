import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/course-view.css';
import { AuthContext } from '../AuthContext';

const CourseView = () => {
  const { courseId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [course, setCourse] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [visitedChapters, setVisitedChapters] = useState(new Set());
  const [error, setError] = useState('');

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
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'X-User-Id': userId,
          },
        });
        setCourse(response.data);
        setVisitedChapters(new Set([0])); // Mark first chapter as visited
        setError('');
      } catch (error) {
        const errorMessage =
          error.response?.status === 401
            ? 'Session expired. Please log in again.'
            : error.response?.status === 404
            ? 'Course not found.'
            : error.response?.data?.message || 'Failed to fetch course. Please try again.';
        setError(errorMessage);
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
  }, [courseId, isLoggedIn, userId, navigate]);

  const handleNextChapter = () => {
    if (currentChapterIndex < course.chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIndex);
      setVisitedChapters((prev) => new Set(prev).add(nextIndex));
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIndex);
      setVisitedChapters((prev) => new Set(prev).add(prevIndex));
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!course) {
    return <div className="loading">Loading...</div>;
  }

  const currentChapter = course.chapters[currentChapterIndex];
  const completionPercentage = (visitedChapters.size / course.chapters.length) * 100;

  return (
    <div className="course-view-page">
      <div className="course-header">
        <h2>{course.name}</h2>
        <p>{course.description}</p>
        <p>Created by: {course.username || 'Unknown'}</p>
      </div>

      <div className="completion-bar-container">
        <div
          className="completion-bar"
          style={{ width: `${completionPercentage}%` }}
        >
          {Math.round(completionPercentage)}% Complete
        </div>
      </div>

      <div className="chapter-container">
        <h3>{currentChapter.title}</h3>
        <p>{currentChapter.description}</p>
        {currentChapter.youtubeUrl && (
          <div className="youtube-embed">
            <iframe
              width="560"
              height="315"
              src={currentChapter.youtubeUrl.replace('watch?v=', 'embed/')}
              title={currentChapter.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <button
          className="nav-btn"
          onClick={handlePreviousChapter}
          disabled={currentChapterIndex === 0}
        >
          &lt; Previous
        </button>
        <span>
          Chapter {currentChapterIndex + 1} of {course.chapters.length}
        </span>
        <button
          className="nav-btn"
          onClick={handleNextChapter}
          disabled={currentChapterIndex === course.chapters.length - 1}
        >
          Next &gt;
        </button>
      </div>

      <button
        className="back-btn"
        onClick={() => navigate('/my-courses')}
      >
        Back to My Courses
      </button>
    </div>
  );
};

export default CourseView;