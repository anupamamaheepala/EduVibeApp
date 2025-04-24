import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import '../../css/course-form.css';

const CourseForm = () => {
  const [course, setCourse] = useState({
    name: '',
    description: '',
    chapters: [{ title: '', description: '', youtubeUrl: '' }],
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Course Data:', course);
    // Add your submit logic here (e.g., API call)
  };

  return (
    <div className="course-form-page">
      <Header />
      <div className="form-section">
        <div className="form-container">
          <h1 className="form-title">Add New Course</h1>
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
              <button type="submit" className="submit-btn">
                Create Course
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseForm;