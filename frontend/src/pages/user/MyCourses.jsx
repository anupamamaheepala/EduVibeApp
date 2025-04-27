import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
//import UserHeader from '../UserHeader';
//import Header from '../Header';
//import Footer from '../Footer';
import '../../css/all-courses.css';
import { AuthContext } from '../AuthContext';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [message, setMessage] = useState('');
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to view your courses.',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/user/${userId}`, {
          headers: { 'X-User-Id': userId },
        });

        setCourses(response.data);
        setMessage('');
      } catch (error) {
        const errorMessage =
          error.response?.status === 401
            ? 'Session expired. Please log in again.'
            : error.response?.data?.message || 'Failed to fetch courses. Please try again.';
        
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
          }
        });
      }
    };

    fetchCourses();
  }, [isLoggedIn, userId, navigate]);

  const handleDelete = async (courseId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This will permanently delete the course.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ff4d4f', // Match delete button color
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/courses/${courseId}`, {
        headers: { 'X-User-Id': userId },
      });

      // Update courses state to remove deleted course
      setCourses(courses.filter((course) => course.id !== courseId));
      setMessage('Course deleted successfully');
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Course deleted successfully!',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      const errorMessage =
        error.response?.status === 401
          ? 'Session expired. Please log in again.'
          : error.response?.status === 403
          ? 'You are not authorized to delete this course.'
          : error.response?.status === 404
          ? 'Course not found.'
          : error.response?.data?.message || 'Failed to delete course. Please try again.';
      
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
        }
      });
    }
  };

  const handleUpdate = (courseId) => {
    // Navigate to the edit course page
    navigate(`/edit-course/${courseId}`);
  };

  const toggleSearchBy = () => {
    setSearchBy(searchBy === 'name' ? 'author' : 'name');
    setSearchTerm('');
  };

  const filteredCourses = courses.filter((course) =>
    searchBy === 'name'
      ? (course.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      : (course.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="all-courses-page">
     
      <div className="semi-header my-courses-header">
        <div className="search-container">
          <h2>My Courses</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder={`Search by ${searchBy}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="toggle-search-btn" onClick={toggleSearchBy}>
              Search by {searchBy === 'name' ? 'Author' : 'Name'}
            </button>
            <button className="add-course-btn" onClick={() => navigate('/add-course')}>
              Add New Course
            </button>
          </div>
        </div>
      </div>
      <div className="courses-section">
        <div className="courses-grid">
          {message && (
            <p className={`feedback-message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <h3>{course.name || 'Unnamed Course'}</h3>
                <p>{course.description || 'No description available'}</p>
                <p>Created by: {course.username || 'Unknown'}</p>
                <div className="course-actions">
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    View Course
                  </button>
                  <button
                    className="update-btn"
                    onClick={() => handleUpdate(course.id)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-courses">No courses found.</p>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default MyCourses;