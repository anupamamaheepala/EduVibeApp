import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../UserHeader';
import Footer from '../Footer';
import '../../css/courses/all-courses.css';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // 'name' or 'author'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
      : course.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSearchBy = () => {
    setSearchBy(searchBy === 'name' ? 'author' : 'name');
    setSearchTerm('');
  };

  return (
    <div className="all-courses-page">
      <Header />
      <div className="all-courses-semi-header">
        <div className="all-courses-search-container">
          <h2>Explore All Courses</h2>
          <div className="all-courses-search-bar">
            <input
              type="text"
              placeholder={`Search by ${searchBy}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="all-courses-toggle-btn" onClick={toggleSearchBy}>
              Search by {searchBy === 'name' ? 'Author' : 'Name'}
            </button>
          </div>
        </div>
      </div>
      <div className="all-courses-section">
        <div className="all-courses-grid">
          {loading ? (
            <p>Loading courses...</p>
          ) : error ? (
            <p className="all-courses-error">Error: {error}</p>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="all-courses-card">
                <div className="all-courses-content">
                  <h3>{course.name}</h3>
                  <p className="all-courses-author">By {course.username}</p>
                  <p className="all-courses-description">{course.description}</p>
                  <div className="all-courses-meta">
                    <span>{course.chapters ? course.chapters.length : 0} Chapters</span>
                  </div>
                </div>
                <div className="all-courses-actions">
                  <button
                    className="all-courses-view-btn"
                    onClick={() => navigate(`/view-all-course/${course.id}`)}
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="all-courses-no-courses">No courses found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllCourses;