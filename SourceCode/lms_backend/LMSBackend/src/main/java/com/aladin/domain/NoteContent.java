package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A NoteContent.
 */
@Entity
@Table(name = "note_content")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class NoteContent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "note_content_title")
    private String noteContentTitle;

    @Column(name = "note_content_content")
    private String noteContentContent;

    @ManyToOne
    @JsonIgnoreProperties(value = { "noteContents" }, allowSetters = true)
    private Note note;

    @ManyToOne
    @JsonIgnoreProperties(value = { "questions", "typeOfExams" }, allowSetters = true)
    private Exams exams;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NoteContent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNoteContentTitle() {
        return this.noteContentTitle;
    }

    public NoteContent noteContentTitle(String noteContentTitle) {
        this.setNoteContentTitle(noteContentTitle);
        return this;
    }

    public void setNoteContentTitle(String noteContentTitle) {
        this.noteContentTitle = noteContentTitle;
    }

    public String getNoteContentContent() {
        return this.noteContentContent;
    }

    public NoteContent noteContentContent(String noteContentContent) {
        this.setNoteContentContent(noteContentContent);
        return this;
    }

    public void setNoteContentContent(String noteContentContent) {
        this.noteContentContent = noteContentContent;
    }

    public Note getNote() {
        return this.note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public NoteContent note(Note note) {
        this.setNote(note);
        return this;
    }

    public Exams getExams() {
        return this.exams;
    }

    public void setExams(Exams exams) {
        this.exams = exams;
    }

    public NoteContent exams(Exams exams) {
        this.setExams(exams);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NoteContent)) {
            return false;
        }
        return id != null && id.equals(((NoteContent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NoteContent{" +
            "id=" + getId() +
            ", noteContentTitle='" + getNoteContentTitle() + "'" +
            ", noteContentContent='" + getNoteContentContent() + "'" +
            "}";
    }
}
