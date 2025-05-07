import React, { useState, useEffect } from 'react';
import Header from '../UserHeader';
import Footer from '../Footer';
import '../../css/all-courses.css';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // 'name' or 'author'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/courses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term and search type
  const filteredCourses = courses.filter((course) =>
    searchBy === 'name'
      ? course.name.toLowerCase().includes(searchTerm.toLowerCase())
      : course.username.toLowerCase().includes(searchTerm.toLowerCase()) // Use username instead of createdBy
  );

  const toggleSearchBy = () => {
    setSearchBy(searchBy === 'name' ? 'author' : 'name');
    setSearchTerm('');
  };

  return (
    <div className="all-courses-page">
      <Header />
      <div className="semi-header">
        <div className="search-container">
          <h2>Explore All Courses</h2>
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
      </div>
      <div className="courses-section">
        <div className="courses-grid">
          {loading ? (
            <p>Loading courses...</p>
          ) : error ? (
            <p className="error">Error: {error}</p>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-image"></div>
                <div className="course-content">
                  <h3>{course.name}</h3>
                  <p className="course-author">By {course.username}</p> {/* Use username */}
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>{course.chapters ? course.chapters.length : 0} Chapters</span>
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

export default AllCourses;