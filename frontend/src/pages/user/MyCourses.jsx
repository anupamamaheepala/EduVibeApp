import React, { useState } from 'react';
import '../../css/all-courses.css';

// Mock data (replace with actual data fetch)
const mockCourses = [
  {
    id: 1,
    name: 'Web Development Bootcamp',
    author: 'John Doe',
    description: 'Learn full-stack web development with hands-on projects.',
    chapters: 24,
    image: '', // Placeholder for image URL
  },
  {
    id: 2,
    name: 'UI/UX Design Fundamentals',
    author: 'Jane Smith',
    description: 'Master the art of user interface and experience design.',
    chapters: 18,
    image: '',
  },
  {
    id: 3,
    name: 'Digital Marketing Strategy',
    author: 'Alex Brown',
    description: 'Boost your business with proven marketing techniques.',
    chapters: 20,
    image: '',
  },
];

const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // 'name' or 'author'

  // Filter courses based on search term and search type
  const filteredCourses = mockCourses.filter((course) =>
    searchBy === 'name'
      ? course.name.toLowerCase().includes(searchTerm.toLowerCase())
      : course.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSearchBy = () => {
    setSearchBy(searchBy === 'name' ? 'author' : 'name');
    setSearchTerm(''); // Clear search term when toggling
  };

  return (
    <div className="dashboard-courses-container">
      {/* Search Section */}
      <div className="dashboard-courses-header">
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
        </div>
      </div>

      {/* Courses Grid */}
      <div className="dashboard-courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="dashboard-course-card">
              <div className="course-image"></div>
              <div className="course-content">
                <h3>{course.name}</h3>
                <p className="course-author">By {course.author}</p>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span>{course.chapters} Chapters</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-courses">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default MyCourses;