package com.aladin.service.dto;

public class ClassroomDepartmentDTO {
    private Long departmentID;
    private String departmentName;
    private Long classroomID;
    private String classroomName;
    private String classroomCode;
    private Integer classroomTotalStudent;

    public ClassroomDepartmentDTO(Long departmentID, String departmentName, Long classroomID, String classroomName, String classroomCode, Integer classroomTotalStudent) {
        this.departmentID = departmentID;
        this.departmentName = departmentName;
        this.classroomID = classroomID;
        this.classroomName = classroomName;
        this.classroomCode = classroomCode;
        this.classroomTotalStudent = classroomTotalStudent;
    }

    public Long getDepartmentID() {
        return departmentID;
    }

    public void setDepartmentID(Long departmentID) {
        this.departmentID = departmentID;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
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

    @Override
    public String toString() {
        return "ClassroomDepartmentDTO{" +
            "departmentID=" + departmentID +
            ", departmentName='" + departmentName + '\'' +
            ", classroomID=" + classroomID +
            ", classroomName='" + classroomName + '\'' +
            ", classroomCode='" + classroomCode + '\'' +
            ", classroomTotalStudent='" + classroomTotalStudent + '\'' +
            '}';
    }
}
