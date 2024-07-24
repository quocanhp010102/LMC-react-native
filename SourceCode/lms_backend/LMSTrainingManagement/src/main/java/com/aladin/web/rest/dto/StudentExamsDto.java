package com.aladin.web.rest.dto;

import com.aladin.domain.ExamsHistory;
import com.aladin.domain.Student;

import java.util.Objects;

public class StudentExamsDto {

    private Long id;
    private String fullname;
    private String code;
    private String point;
    private String img;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPoint() {
        return point;
    }

    public void setPoint(String point) {
        this.point = point;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public StudentExamsDto(ExamsHistory examsHistory) {
        if (examsHistory == null){

        }
        else{
            this.code = examsHistory.getStudent().getStudent_code();
            this.fullname = examsHistory.getStudent().getStudent_fullname();
            this.point = examsHistory.getExamsHistoryPoint();
            this.id = examsHistory.getStudent().getId();
        }

    }

    public StudentExamsDto(Long id, String fullname, String code,String img, String point) {
        this.id = id;
        this.fullname = fullname;
        this.code = code;
        this.img = img;
        this.point = point;
    }

    public StudentExamsDto(Long id, String fullname, String code,String img) {
        this.id = id;
        this.fullname = fullname;
        this.code = code;
        this.img = img;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StudentExamsDto that = (StudentExamsDto) o;
        return code.equals(that.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }
}
