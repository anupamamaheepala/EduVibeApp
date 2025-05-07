package com.eduvibe.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "course_progress")
public class CourseProgress {

    @Id
    private String id;
    private String userId;
    private String courseId;
    private List<Integer> completedChapterIndices; // Stores indices of completed chapters
    private double completionPercentage;

    public CourseProgress() {
        this.completedChapterIndices = new ArrayList<>();
        this.completionPercentage = 0.0;
    }

    public CourseProgress(String userId, String courseId) {
        this.userId = userId;
        this.courseId = courseId;
        this.completedChapterIndices = new ArrayList<>();
        this.completionPercentage = 0.0;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public List<Integer> getCompletedChapterIndices() { return completedChapterIndices; }
    public void setCompletedChapterIndices(List<Integer> completedChapterIndices) {
        this.completedChapterIndices = completedChapterIndices;
    }

    public double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}