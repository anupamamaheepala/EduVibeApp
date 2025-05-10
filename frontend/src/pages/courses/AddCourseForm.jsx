import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../Header';
import UserHeader from '../UserHeader';
import Footer from '../Footer';
import '../../css/courses/course-form.css';
import { AuthContext } from '../AuthContext';

const CourseForm = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEditMode = !!courseId;

  const [course, setCourse] = useState({
    name: '',
    description: '',
    chapters: [{ title: '', description: '', youtubeUrl: '' }],
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (isEditMode && isLoggedIn && userId) {
      const fetchCourse = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/courses/${courseId}`, {
            headers: {
              'X-User-Id': userId,
              'Authorization': `Bearer ${token}`,
            },
          });
          const courseData = response.data.course;
          setCourse({
            name: courseData.name || '',
            description: courseData.description || '',
            chapters: courseData.chapters && courseData.chapters.length > 0
              ? courseData.chapters
              : [{ title: '', description: '', youtubeUrl: '' }],
          });
          setErrors({});
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

  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
    return youtubeRegex.test(url);
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };
    if (name === 'name') {
      if (!value) newErrors.name = 'Course name is required.';
      else if (value.length < 3) newErrors.name = 'Course name must be at least 3 characters long.';
      else if (value.length > 100) newErrors.name = 'Course name cannot exceed 100 characters.';
      else delete newErrors.name;
    } else if (name === 'description') {
      if (!value) newErrors.description = 'Course description is required.';
      else if (value.length < 10) newErrors.description = 'Course description must be at least 10 characters long.';
      else if (value.length > 500) newErrors.description = 'Course description cannot exceed 500 characters.';
      else delete newErrors.description;
    }
    setErrors(newErrors);
  };

  const handleChapterChange = (index, e) => {
    const { name, value } = e.target;
    const updatedChapters = [...course.chapters];
    updatedChapters[index] = { ...updatedChapters[index], [name]: value };
    setCourse((prev) => ({ ...prev, chapters: updatedChapters }));

    const newErrors = { ...errors };
    if (!newErrors.chapters) newErrors.chapters = course.chapters.map(() => ({}));

    if (name === 'title') {
      if (!value) newErrors.chapters[index].title = 'Chapter title is required.';
      else if (value.length < 3) newErrors.chapters[index].title = 'Chapter title must be at least 3 characters long.';
      else if (value.length > 50) newErrors.chapters[index].title = 'Chapter title cannot exceed 50 characters.';
      else delete newErrors.chapters[index].title;
    } else if (name === 'description') {
      if (!value) newErrors.chapters[index].description = 'Chapter description is required.';
      else if (value.length < 10) newErrors.chapters[index].description = 'Chapter description must be at least 10 characters long.';
      else if (value.length > 300) newErrors.chapters[index].description = 'Chapter description cannot exceed 300 characters.';
      else delete newErrors.chapters[index].description;
    } else if (name === 'youtubeUrl') {
      if (!value) newErrors.chapters[index].youtubeUrl = 'YouTube URL is required.';
      else if (!validateYouTubeUrl(value)) newErrors.chapters[index].youtubeUrl = 'Please enter a valid YouTube URL.';
      else delete newErrors.chapters[index].youtubeUrl;
    }
    setErrors(newErrors);
  };

  const addChapter = () => {
    setCourse((prev) => ({
      ...prev,
      chapters: [...prev.chapters, { title: '', description: '', youtubeUrl: '' }],
    }));
    setErrors((prev) => ({
      ...prev,
      chapters: [...(prev.chapters || []), {}],
    }));
  };

  const removeChapter = (index) => {
    setCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      chapters: prev.chapters ? prev.chapters.filter((_, i) => i !== index) : [],
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

    const hasErrors = Object.keys(errors).some(key => 
      (key === 'name' || key === 'description' || (key === 'chapters' && errors.chapters.some(ch => Object.keys(ch).length > 0)))
    );
    if (hasErrors) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting.',
      });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isEditMode) {
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
              'Authorization': `Bearer ${token}`,
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
            'Authorization': `Bearer ${token}`,
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
      setErrors({});
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
                className={errors.name ? 'has-error' : ''}
              />
              {errors.name && <p className="course-form-error">{errors.name}</p>}
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
                className={errors.description ? 'has-error' : ''}
              ></textarea>
              {errors.description && <p className="course-form-error">{errors.description}</p>}
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
                    className={errors.chapters && errors.chapters[index]?.title ? 'has-error' : ''}
                  />
                  {errors.chapters && errors.chapters[index]?.title && (
                    <p className="course-form-error">{errors.chapters[index].title}</p>
                  )}
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
                    className={errors.chapters && errors.chapters[index]?.description ? 'has-error' : ''}
                  ></textarea>
                  {errors.chapters && errors.chapters[index]?.description && (
                    <p className="course-form-error">{errors.chapters[index].description}</p>
                  )}
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
                    className={errors.chapters && errors.chapters[index]?.youtubeUrl ? 'has-error' : ''}
                  />
                  {errors.chapters && errors.chapters[index]?.youtubeUrl && (
                    <p className="course-form-error">{errors.chapters[index].youtubeUrl}</p>
                  )}
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