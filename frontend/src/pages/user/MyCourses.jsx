import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../css/all-courses.css';

// Mock data for user-created courses
const myMockCourses = [
  {
    id: 1,
    name: 'My Web Development Course',
    author: 'Me',
    description: 'A course I created to teach web development basics.',
    chapters: 10,
    image: '', // Placeholder for image URL
  },
  {
    id: 2,
    name: 'My Design Principles',
    author: 'Me',
    description: 'Learn design fundamentals through my perspective.',
    chapters: 8,
    image: '',
  },
];

const MyCourses = () => {
  const navigate = useNavigate();

  return (
    <div className="all-courses-page">
      <Header />
      <div className="semi-header my-courses-header">
        <div className="search-container">
          <h2>My Courses</h2>
          <button className="add-course-btn" onClick={() => navigate('/add-course')}>
            Add New Course
          </button>
        </div>
      </div>
      <div className="courses-section">
        <div className="courses-grid">
          {myMockCourses.length > 0 ? (
            myMockCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-image"></div>
                <div className="course-content">
                  <h3>{course.name}</h3>
                  <p className="course-author">By {course.author}</p>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>{course.chapters} Chapters</span>
                  </div>
                  <div className="course-actions">
                    <button className="update-btn">Update</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-courses">No courses found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyCourses;