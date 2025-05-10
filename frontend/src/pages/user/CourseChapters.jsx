import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../AuthContext';
import '../../css/course-chapters.css';

const CourseChapters = () => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to continue the course.',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    const fetchCourseAndProgress = async () => {
      try {
        const courseResponse = await axios.get(`http://localhost:8000/api/courses/${courseId}`, {
          headers: { 'X-User-Id': userId },
        });

        const progressResponse = await axios.get(`http://localhost:8000/api/courses/${courseId}/progress`, {
          headers: { 'X-User-Id': userId },
        });

        setCourse(courseResponse.data.course);
        setProgress(progressResponse.data);
        setMessage('');
      } catch (error) {
        const errorMessage =
          error.response?.status === 401
            ? 'Session expired. Please log in again.'
            : error.response?.status === 404
            ? 'Course or progress not found.'
            : error.response?.data?.message || 'Failed to fetch course details. Please try again.';

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
            navigate('/dashboard/learning-plan');
          }
        });
      }
    };

    fetchCourseAndProgress();
  }, [isLoggedIn, userId, courseId, navigate]);

  const handleChapterClick = (chapter, index) => {
    setSelectedChapter({ ...chapter, index });
  };

  const handleMarkAsDone = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/courses/${courseId}/complete-chapter/${selectedChapter.index}`,
        {},
        { headers: { 'X-User-Id': userId } }
      );

      setProgress(response.data);
      setSelectedChapter(null);
      Swal.fire({
        icon: 'success',
        title: 'Chapter Completed',
        text: 'Chapter marked as completed!',
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to mark chapter as completed. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  const closeModal = () => {
    setSelectedChapter(null);
  };

  if (!course && !message) {
    return <div className="course-chapters-page">Loading...</div>;
  }

  return (
    <div className="course-chapters-page">
      <div className="course-chapters-header">
        <div className="header-container">
          <h2>{course?.name || 'Course Chapters'}</h2>
          <button className="back-btn" onClick={() => navigate('/dashboard/learning-plan')}>
            Back to Learning Plans
          </button>
        </div>
      </div>
      <div className="chapters-section">
        {message && (
          <p className={`feedback-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        {course && (
          <div className="chapters-container">
            <div className="chapters-list">
              {course.chapters && course.chapters.length > 0 ? (
                course.chapters.map((chapter, index) => (
                  <div key={index} className="chapter-item">
                    <input
                      type="checkbox"
                      checked={progress?.completedChapterIndices?.includes(index) || false}
                      readOnly
                    />
                    <span
                      className="chapter-title"
                      onClick={() => handleChapterClick(chapter, index)}
                    >
                      {`${index + 1}. ${chapter.title || `Chapter ${index + 1}`}`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="no-chapters">No chapters available for this course.</p>
              )}
            </div>
            {progress && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress.completionPercentage}%` }}
                  ></div>
                </div>
                <span className="progress-percentage">
                  {progress.completionPercentage.toFixed(1)}% Complete
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedChapter && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedChapter.title || `Chapter ${selectedChapter.index + 1}`}</h3>
            <p>{selectedChapter.description || 'No description available'}</p>
            {selectedChapter.youtubeUrl ? (
              <a
                href={selectedChapter.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-link"
              >
                Watch on YouTube
              </a>
            ) : (
              <p>No YouTube video available</p>
            )}
            <div className="modal-actions">
              <button className="done-btn" onClick={handleMarkAsDone}>
                Done
              </button>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseChapters;