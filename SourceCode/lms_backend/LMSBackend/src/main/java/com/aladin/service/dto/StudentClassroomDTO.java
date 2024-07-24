package com.aladin.service.dto;

import com.aladin.domain.Classroom;

import java.io.Serializable;
import java.time.LocalDate;

public class StudentClassroomDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private Long student_id;

    private String studentCode;
    private String studentFullname;

    private String studentEmail;

    private String studentPhone;

    private LocalDate studentBirthday;


    private Long classroomID;

    private String classroomName;

    private String classroomCode;

    private Integer classroomTotalStudent;

    public StudentClassroomDTO(Long student_id, String studentCode, String studentFullname, String studentEmail, String studentPhone, LocalDate studentBirthday, Long classroomID, String classroomName, String classroomCode, Integer classroomTotalStudent) {
        this.student_id = student_id;
        this.studentCode = studentCode;
        this.studentFullname = studentFullname;
        this.studentEmail = studentEmail;
        this.studentPhone = studentPhone;
        this.studentBirthday = studentBirthday;
        this.classroomID = classroomID;
        this.classroomName = classroomName;
        this.classroomCode = classroomCode;
        this.classroomTotalStudent = classroomTotalStudent;
    }

    public StudentClassroomDTO() {
    }

    public Long getStudent_id() {
        return student_id;
    }

    public void setStudent_id(Long student_id) {
        this.student_id = student_id;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getStudentFullname() {
        return studentFullname;
    }

    public void setStudentFullname(String studentFullname) {
        this.studentFullname = studentFullname;
    }

    public Long getClassroomID() {
        return classroomID;
    }

    public void setClassroomID(Long classroomID) {
        this.classroomID = classroomID;
    }

    public String getClassroomName() {
        return classroomName;
    }

    public void setClassroomName(String classroomName) {
        this.classroomName = classroomName;
    }

    public String getClassroomCode() {
        return classroomCode;
    }

    public void setClassroomCode(String classroomCode) {
        this.classroomCode = classroomCode;
    }

    public Integer getClassroomTotalStudent() {
        return classroomTotalStudent;
    }

    public void setClassroomTotalStudent(Integer classroomTotalStudent) {
        this.classroomTotalStudent = classroomTotalStudent;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentPhone() {
        return studentPhone;
    }

    public void setStudentPhone(String studentPhone) {
        this.studentPhone = studentPhone;
    }

    public LocalDate getStudentBirthday() {
        return studentBirthday;
    }

    public void setStudentBirthday(LocalDate studentBirthday) {
        this.studentBirthday = studentBirthday;
    }
}
