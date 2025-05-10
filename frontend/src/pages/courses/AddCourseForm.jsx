import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../Header';
import UserHeader from '../UserHeader';
import Footer from '../Footer';
import '../../css/course-form.css';
import { AuthContext } from '../AuthContext';

const CourseForm = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { courseId } = useParams(); // Get courseId from URL for edit mode
  const isEditMode = !!courseId; // True if courseId exists (edit mode)

  const [course, setCourse] = useState({
    name: '',
    description: '',
    chapters: [{ title: '', description: '', youtubeUrl: '' }],
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token'); // Assuming token is stored
  const username = localStorage.getItem('username');

  // Fetch course data for edit mode
  useEffect(() => {
    if (isEditMode && isLoggedIn && userId) {
      const fetchCourse = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/courses/${courseId}`, {
            headers: {
              'X-User-Id': userId,
              'Authorization': `Bearer ${token}`, // Add token if required
            },
          });
          const courseData = response.data.course; // Match backend response structure
          setCourse({
            name: courseData.name || '',
            description: courseData.description || '',
            chapters: courseData.chapters && courseData.chapters.length > 0
              ? courseData.chapters
              : [{ title: '', description: '', youtubeUrl: '' }],
          });
        } catch (error) {
          console.error('Fetch course error:', error.response ? error.response.data : error.message);
          const errorMessage =
            error.response?.status === 401
              ? 'Session expired. Please log in again.'
              : error.response?.status === 403
              ? 'You are not authorized to view this course.'
              : error.response?.status === 404
              ? 'Course not found.'
              : error.response?.data?.message || 'Failed to load course data. Please try again.';
          setMessage(`Error: ${errorMessage}`);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
        }
      };
      fetchCourse();
    }
  }, [isEditMode, courseId, isLoggedIn, userId, token]);

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleChapterChange = (index, e) => {
    const { name, value } = e.target;
    const updatedChapters = [...course.chapters];
    updatedChapters[index] = { ...updatedChapters[index], [name]: value };
    setCourse((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const addChapter = () => {
    setCourse((prev) => ({
      ...prev,
      chapters: [...prev.chapters, { title: '', description: '', youtubeUrl: '' }],
    }));
  };

  const removeChapter = (index) => {
    setCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || !userId) {
      setMessage('You must be logged in to save a course.');
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to continue.',
      }).then(() => navigate('/login'));
      return;
    }

    if (!course.name || !course.description || course.chapters.length === 0) {
      setMessage('Please fill in all required fields.');
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isEditMode) {
        // Update course (PUT request)
        const response = await axios.put(
          `http://localhost:8000/api/courses/${courseId}`,
          {
            name: course.name,
            description: course.description,
            chapters: course.chapters,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-User-Id': userId,
              'Authorization': `Bearer ${token}`, // Add token if required
            },
          }
        );

        Swal.fire({
          title: 'Success!',
          text: 'Course updated successfully!',
          icon: 'success',
          confirmButtonText: 'View Courses',
        }).then(() => {
          navigate('/dashboard/mycourses');
        });
      } else {
        // Create course (POST request)
        const courseData = {
          userId,
          username,
          name: course.name,
          description: course.description,
          chapters: course.chapters,
        };

        const response = await axios.post('http://localhost:8000/api/courses', courseData, {
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId,
            'Authorization': `Bearer ${token}`, // Add token if required
          },
        });

        Swal.fire({
          title: 'Success!',
          text: 'Course created successfully!',
          icon: 'success',
          confirmButtonText: 'View Courses',
        }).then(() => {
          navigate('/dashboard/mycourses');
        });
      }

      setCourse({
        name: '',
        description: '',
        chapters: [{ title: '', description: '', youtubeUrl: '' }],
      });
    } catch (error) {
      console.error(`${isEditMode ? 'Course update' : 'Course creation'} failed:`, error);
      const errorMessage =
        error.response?.status === 403
          ? 'You are not authorized to perform this action.'
          : error.response?.status === 404
          ? 'Course not found.'
          : error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} course. Please try again.`;
      setMessage(`Error: ${errorMessage}`);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-form-page">
      {isLoggedIn ? <UserHeader /> : <Header />}
      <div className="form-section">
        <div className="form-container">
          <h1 className="form-title">{isEditMode ? 'Edit Course' : 'Add New Course'}</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Course Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={course.name}
                onChange={handleCourseChange}
                placeholder="Enter course name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Course Description</label>
              <textarea
                id="description"
                name="description"
                value={course.description}
                onChange={handleCourseChange}
                placeholder="Enter course description"
                rows="4"
                required
              ></textarea>
            </div>
            <h2 className="chapters-title">Chapters</h2>
            {course.chapters.map((chapter, index) => (
              <div key={index} className="chapter-group">
                <div className="form-group">
                  <label htmlFor={`chapter-title-${index}`}>Chapter Title</label>
                  <input
                    type="text"
                    id={`chapter-title-${index}`}
                    name="title"
                    value={chapter.title}
                    onChange={(e) => handleChapterChange(index, e)}
                    placeholder="Enter chapter title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`chapter-description-${index}`}>Chapter Description</label>
                  <textarea
                    id={`chapter-description-${index}`}
                    name="description"
                    value={chapter.description}
                    onChange={(e) => handleChapterChange(index, e)}
                    placeholder="Enter chapter description"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor={`chapter-youtube-${index}`}>YouTube Video URL</label>
                  <input
                    type="url"
                    id={`chapter-youtube-${index}`}
                    name="youtubeUrl"
                    value={chapter.youtubeUrl}
                    onChange={(e) => handleChapterChange(index, e)}
                    placeholder="Enter YouTube video URL"
                    required
                  />
                </div>
                {course.chapters.length > 1 && (
                  <button
                    type="button"
                    className="remove-chapter-btn"
                    onClick={() => removeChapter(index)}
                  >
                    Remove Chapter
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-chapter-btn" onClick={addChapter}>
              Add Another Chapter
            </button>
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Course' : 'Create Course')}
              </button>
            </div>
            {message && (
              <p className={`feedback-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseForm;