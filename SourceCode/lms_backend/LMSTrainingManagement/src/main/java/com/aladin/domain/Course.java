package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(min = 1, max = 2000)
    @Column(name = "course_notification", length = 2000, nullable = true)
    private String courseNotification;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "course_name", length = 50, nullable = false)
    private String courseName;

//    @Size(min = 1, max = 50)
//    @Column(name = "course_code", length = 50,  nullable = true)
//    private String courseCode;

    @Size(min = 1, max = 2000)
    @Column(name = "course_description", length = 2000, nullable = true)
    private String courseDescription;

    @Size(min = 1, max = 50)
    @Column(name = "course_total_Student", length = 50, nullable = true)
    private String courseTotalStudent;

    @NotNull
    @Column(name = "course_created_Date", nullable = true)
    private LocalDate courseCreatedDate;

    @NotNull
    @Size(min = 1, max = 500)
    @Column(name = "course_semester", length = 500, nullable = true)

    private String courseSemester;

    @Size(min = 1, max = 500)
    @Column(name = "course_image", length = 500, nullable = true)

    private String courseImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "courses","user" }, allowSetters = true)
    private Lecturer lecturer;


    @OneToMany(mappedBy = "course",fetch = FetchType.LAZY)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course","histories","filesOfLessons"}, allowSetters = true)
    private Set<Lesson> lessons = new HashSet<>();

    @OneToMany(mappedBy = "course",fetch = FetchType.LAZY)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = {"course"}, allowSetters = true)
    private Set<FilesOfCourse> filesOfCourses = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = {"courses" }, allowSetters = true)
    private Department department;

    @OneToMany(mappedBy = "course",fetch = FetchType.EAGER)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course","courses","examsHistories" }, allowSetters = true)
    private Set<CourseStudent> courseStudents = new HashSet<>();

    @OneToMany(mappedBy = "course",fetch = FetchType.LAZY)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course" }, allowSetters = true)
    private Set<Exams> exams = new HashSet<>();

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course", "user","lesson" }, allowSetters = true)
    private Set<History> histories = new HashSet<>();


    public Set<Exams> getExams() {
        return exams;
    }

    public void setExams(Set<Exams> exams) {
        this.exams = exams;
    }

    public String getCourseImage() {
        return courseImage;
    }

    public void setCourseImage(String courseImage) {
        this.courseImage = courseImage;
    }
    // jhipster-needle-entity-add-field - JHipster will add fields here


    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Lecturer getLecturer() {
        return lecturer;
    }

    public void setLecturer(Lecturer lecturer) {
        this.lecturer = lecturer;
    }

    public Long getId() {
        return this.id;
    }

    public Course id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseNotification() {
        return this.courseNotification;
    }

    public Course courseNotification(String courseNotification) {
        this.setCourseNotification(courseNotification);
        return this;
    }


    public void setCourseNotification(String courseNotification) {
        this.courseNotification = courseNotification;
    }

    public String getCourseName() {
        return this.courseName;
    }

    public String getCourseSemester() {
        return courseSemester;
    }

    public void setCourseSemester(String courseSemester) {
        this.courseSemester = courseSemester;
    }

    public Course courseName(String courseName) {
        this.setCourseName(courseName);
        return this;
    }

    public Set<History> getHistories() {
        return histories;
    }

    public void setHistories(Set<History> histories) {
        this.histories = histories;
    }

    public String getCourseDescription() {
        return courseDescription;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
    }

    public String getCourseTotalStudent() {
        return courseTotalStudent;
    }

    public void setCourseTotalStudent(String courseTotalStudent) {
        this.courseTotalStudent = courseTotalStudent;
    }

    public LocalDate getCourseCreatedDate() {
        return courseCreatedDate;
    }

    public void setCourseCreatedDate(LocalDate courseCreatedDate) {
        this.courseCreatedDate = courseCreatedDate;
    }

//    public Department getDepartment() {
//        return department;
//    }
//
//    public void setDepartment(Department department) {
//        this.department = department;
//    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Set<Lesson> getLessons() {
        return this.lessons;
    }

    public void setLessons(Set<Lesson> lessons) {
        if (this.lessons != null) {
            this.lessons.forEach(i -> i.setCourse(null));
        }
        if (lessons != null) {
            lessons.forEach(i -> i.setCourse(this));
        }
        this.lessons = lessons;
    }

    public Course lessons(Set<Lesson> lessons) {
        this.setLessons(lessons);
        return this;
    }

    public Course addLesson(Lesson lesson) {
        this.lessons.add(lesson);
        lesson.setCourse(this);
        return this;
    }

    public Course removeLesson(Lesson lesson) {
        this.lessons.remove(lesson);
        lesson.setCourse(null);
        return this;
    }

    public Set<FilesOfCourse> getFilesOfCourses() {
        return this.filesOfCourses;
    }

    public void setFilesOfCourses(Set<FilesOfCourse> filesOfCourses) {
        if (this.filesOfCourses != null) {
            this.filesOfCourses.forEach(i -> i.setCourse(null));
        }
        if (filesOfCourses != null) {
            filesOfCourses.forEach(i -> i.setCourse(this));
        }
        this.filesOfCourses = filesOfCourses;
    }

    public Course filesOfCourses(Set<FilesOfCourse> filesOfCourses) {
        this.setFilesOfCourses(filesOfCourses);
        return this;
    }

    public Course addFilesOfCourse(FilesOfCourse filesOfCourse) {
        this.filesOfCourses.add(filesOfCourse);
        filesOfCourse.setCourse(this);
        return this;
    }

    public Course removeFilesOfCourse(FilesOfCourse filesOfCourse) {
        this.filesOfCourses.remove(filesOfCourse);
        filesOfCourse.setCourse(null);
        return this;
    }

    public Set<CourseStudent> getCourseStudents() {
        return this.courseStudents;
    }

    public void setCourseStudents(Set<CourseStudent> courseStudents) {
        if (this.courseStudents != null) {
            this.courseStudents.forEach(i -> i.setCourse(null));
        }
        if (courseStudents != null) {
            courseStudents.forEach(i -> i.setCourse(this));
        }
        this.courseStudents = courseStudents;
    }

    public Course courseStudent(Set<CourseStudent> courseStudents) {
        this.setCourseStudents(courseStudents);
        return this;
    }

    public Course addCourseStudent(CourseStudent courseStudent) {
        this.courseStudents.add(courseStudent);
        courseStudent.setCourse(this);
        return this;
    }

    public Course removeCourseStudent(CourseStudent courseStudent) {
        this.courseStudents.remove(courseStudent);
        courseStudent.setCourse(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course)) {
            return false;
        }
        return id != null && id.equals(((Course) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore


    @Override
    public String toString() {
        return "Course{" +
            "id=" + id +
            ", courseNotification='" + courseNotification + '\'' +
            ", courseName='" + courseName + '\'' +
//            ", courseCode='" + courseCode + '\'' +
            ", courseDescription='" + courseDescription + '\'' +
            ", courseTotalStudent='" + courseTotalStudent + '\'' +
            ", courseCreatedDate=" + courseCreatedDate +
            ", courseSemester='" + courseSemester + '\'' +
            ", courseImage='" + courseImage + '\'' +
            ", lecturer=" + lecturer +
//            ", lessons=" + lessons +
//            ", filesOfCourses=" + filesOfCourses +
//            ", courseStudents=" + courseStudents +
            '}';
    }

    public String searchField() {
        return "courseName";
    }


    public String ResponseField() {
        return "courseName,courseImage,courseCode,courseTotalStudent,courseCreatedDate,courseSemester";
    }

}
