package com.aladin.service.dto;

import com.aladin.domain.Department;
import com.aladin.search.helper.Indices;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Id;
import java.io.Serializable;

/**
 * A Department.
 */
@Document(indexName = Indices.DEPARTMENT_INDEX)
public class DepartmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Field(type = FieldType.Keyword)
    private Long id;


    private String department_name;


    private String department_type;


    private String department_image;

    public DepartmentDTO() {
    }

    public DepartmentDTO(Department department) {
        this.id=department.getId();
        this.department_image=department.getDepartment_image();
        this.department_name=department.getDepartment_name();
        this.department_type=department.getDepartment_type();
    }

    public Long getId() {
        return this.id;
    }

    public DepartmentDTO id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartment_name() {
        return this.department_name;
    }

    public DepartmentDTO department_name(String department_name) {
        this.setDepartment_name(department_name);
        return this;
    }

    public void setDepartment_name(String department_name) {
        this.department_name = department_name;
    }

    public String getDepartment_type() {
        return this.department_type;
    }

    public DepartmentDTO department_type(String department_type) {
        this.setDepartment_type(department_type);
        return this;
    }

    public void setDepartment_type(String department_type) {
        this.department_type = department_type;
    }

    public String getDepartment_image() {
        return department_image;
    }

    public void setDepartment_image(String department_image) {
        this.department_image = department_image;
    }






}
