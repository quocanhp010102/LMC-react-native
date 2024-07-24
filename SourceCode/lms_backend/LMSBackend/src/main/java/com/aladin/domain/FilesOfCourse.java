package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A FilesOfCourse.
 */
@Entity
@Table(name = "files_of_course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FilesOfCourse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 1, max = 500)
    @Column(name = "file_of_course_path", length = 500, nullable = false )
    private String fileOfCoursePath;

    @Size(min = 1)
    @Column(name = "file_of_course_name",  nullable = true)
    private String fileOfCourseName;

    @ManyToOne
    @JsonIgnoreProperties(value = { "lessons", "filesOfCourses","lecturer", "department","courseStudents"  }, allowSetters = true)
    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FilesOfCourse id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileOfCoursePath() {
        return this.fileOfCoursePath;
    }

    public FilesOfCourse fileOfCoursePath(String fileOfCoursePath) {
        this.setFileOfCoursePath(fileOfCoursePath);
        return this;
    }

    public void setFileOfCoursePath(String fileOfCoursePath) {
        this.fileOfCoursePath = fileOfCoursePath;
    }

    public Course getCourse() {
        return this.course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public FilesOfCourse course(Course course) {
        this.setCourse(course);
        return this;
    }

    public String getFileOfCourseName() {
        return fileOfCourseName;
    }

    public void setFileOfCourseName(String fileOfCourseName) {
        this.fileOfCourseName = fileOfCourseName;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FilesOfCourse)) {
            return false;
        }
        return id != null && id.equals(((FilesOfCourse) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "FilesOfCourse{" +
            "id=" + id +
            ", fileOfCoursePath='" + fileOfCoursePath + '\'' +
            ", fileOfCourseName='" + fileOfCourseName + '\'' +
//            ", course=" + course +
            '}';
    }
}
