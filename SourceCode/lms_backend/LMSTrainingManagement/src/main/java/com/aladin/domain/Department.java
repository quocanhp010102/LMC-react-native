package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Department.
 */
@Entity
@Table(name = "department")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Department implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "department_name", length = 50, nullable = false, unique = true)
    private String department_name;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "department_type", length = 50, nullable = false)
    private String department_type;

    @Size(min = 1, max = 500)
    @Column(name = "department_image", length = 500, nullable = true)
    private String department_image;

    @OneToMany(mappedBy = "department",fetch = FetchType.EAGER)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "department", "lecturer", "lessons", "filesOfCourses", "courseStudents", "exams", "histories"}, allowSetters = true)
    private Set<Course> courses = new HashSet<>();

    @OneToMany(mappedBy = "department",fetch = FetchType.EAGER)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "department", "classroomStudents"}, allowSetters = true)
    private Set<Classroom> classrooms = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Department id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartment_name() {
        return this.department_name;
    }

    public Department department_name(String department_name) {
        this.setDepartment_name(department_name);
        return this;
    }

    public void setDepartment_name(String department_name) {
        this.department_name = department_name;
    }

    public String getDepartment_type() {
        return this.department_type;
    }

    public Department department_type(String department_type) {
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

    public Set<Course> getCourses() {
        return this.courses;
    }

    public void setCourses(Set<Course> courses) {
        if (this.courses != null) {
            this.courses.forEach(i -> i.setDepartment(null));
        }
        if (courses != null) {
            courses.forEach(i -> i.setDepartment(this));
        }
        this.courses = courses;
    }

    public Department filesOfCourses(Set<Course> courses) {
        this.setCourses(courses);
        return this;
    }

    public Department addCourse(Course course) {
        this.courses.add(course);
        course.setDepartment(this);
        return this;
    }

    public Department removeCourse(Course course) {
        this.courses.remove(course);
        course.setDepartment(null);
        return this;
    }



    public Set<Classroom> getClassrooms() {
        return classrooms;
    }

    public void setClassrooms(Set<Classroom> classrooms) {
        this.classrooms = classrooms;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Department)) {
            return false;
        }
        return id != null && id.equals(((Department) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Department{" +
            "id=" + getId() +
            ", department_name='" + getDepartment_name() + "'" +
            ", department_type='" + getDepartment_type() + "'" +
            "}";
    }


}
