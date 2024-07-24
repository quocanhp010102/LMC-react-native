package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Classroom.
 */
@Entity
@Table(name = "classroom")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Classroom implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 1, max = 500)
    @Column(name = "classroom_name", length = 500, nullable = false, unique = true)
    private String classroomName;

    @Min(value = 0)
    @Column(name = "classroom_total_student")
    private Integer classroomTotalStudent;

    @ManyToOne
    @JsonIgnoreProperties(value = {"classrooms"}, allowSetters = true)
    private Department department;

    @OneToMany(mappedBy = "classroom",fetch = FetchType.EAGER)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "classroom","department", "student", "courseStudent" }, allowSetters = true)
    private Set<ClassroomStudent> classroomStudents = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Classroom id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClassroomName() {
        return this.classroomName;
    }

    public Classroom classroomName(String classroomName) {
        this.setClassroomName(classroomName);
        return this;
    }

    public void setClassroomName(String classroomName) {
        this.classroomName = classroomName;
    }

    public Integer getClassroomTotalStudent() {
        return this.classroomTotalStudent;
    }

    public Classroom classroomTotalStudent(Integer classroomTotalStudent) {
        this.setClassroomTotalStudent(classroomTotalStudent);
        return this;
    }

    public void setClassroomTotalStudent(Integer classroomTotalStudent) {
        this.classroomTotalStudent = classroomTotalStudent;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }


    public Set<ClassroomStudent> getClassroomStudents() {
        return this.classroomStudents;
    }

    public void setClassroomStudents(Set<ClassroomStudent> classroomStudents) {
        if (this.classroomStudents != null) {
            this.classroomStudents.forEach(i -> i.setClassroom(null));
        }
        if (classroomStudents != null) {
            classroomStudents.forEach(i -> i.setClassroom(this));
        }
        this.classroomStudents = classroomStudents;
    }

    public Classroom classroomStudent(Set<ClassroomStudent> classroomStudents) {
        this.setClassroomStudents(classroomStudents);
        return this;
    }

    public Classroom addClassroomStudents(ClassroomStudent classroomStudent) {
        this.classroomStudents.add(classroomStudent);
        classroomStudent.setClassroom(this);
        return this;
    }

    public Classroom removeClassroomStudent(ClassroomStudent classroomStudent) {
        this.classroomStudents.remove(classroomStudent);
        classroomStudent.setClassroom(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Classroom)) {
            return false;
        }
        return id != null && id.equals(((Classroom) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "Classroom{" +
            "id=" + id +
            ", classroomName='" + classroomName + '\'' +
            ", classroomTotalStudent=" + classroomTotalStudent +
//            ", department=" + department +
            '}';
    }
}
