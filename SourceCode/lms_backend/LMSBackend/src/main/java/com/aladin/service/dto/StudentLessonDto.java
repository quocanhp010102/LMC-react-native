package com.aladin.service.dto;

public class StudentLessonDto {
    private Long courseId;
    private String studentName;
    private Integer percent;
    private Long studentId;
    private String studentCode;
    private String courseName;

    public StudentLessonDto() {
    }

    public StudentLessonDto(Long courseId, String studentName, Integer percent) {
        this.courseId = courseId;
        this.studentName = studentName;
        this.percent = percent;
    }

    public StudentLessonDto(Long courseId, String studentName, Integer percent, Long studentId, String studentCode, String courseName) {
        this.courseId = courseId;
        this.studentName = studentName;
        this.percent = percent;
        this.studentId = studentId;
        this.studentCode = studentCode;
        this.courseName = courseName;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Integer getPercent() {
        return percent;
    }

    public void setPercent(Integer percent) {
        this.percent = percent;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
}
