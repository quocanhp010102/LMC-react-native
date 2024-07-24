package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * A FilesOfLesson.
 */
@Entity
@Table(name = "files_of_lesson")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FilesOfLesson implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "files_path", nullable = false)
    private String files_path;

    @Column(name = "files_name", nullable = true)
    private String files_name;


    @ManyToOne
    @JsonIgnoreProperties(value = {"filesOfLessons","lesson"}, allowSetters = true)
    private Lesson lesson;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FilesOfLesson id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFiles_path() {
        return this.files_path;
    }

    public FilesOfLesson files_path(String files_path) {
        this.setFiles_path(files_path);
        return this;
    }

    public void setFiles_path(String files_path) {
        this.files_path = files_path;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public String getFiles_name() {
        return files_name;
    }

    public void setFiles_name(String files_name) {
        this.files_name = files_name;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FilesOfLesson)) {
            return false;
        }
        return id != null && id.equals(((FilesOfLesson) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore


    @Override
    public String toString() {
        return "FilesOfLesson{" +
            "id=" + id +
            ", files_path='" + files_path + '\'' +
            ", files_name='" + files_name + '\'' +
            ", lesson=" + lesson +
            '}';
    }
}
