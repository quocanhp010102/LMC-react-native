package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A Note.
 */
@Entity
@Table(name = "note")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Note implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "note_date", nullable = false)
    private Date noteDate;

    @OneToMany(mappedBy = "note")
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = {  "note" }, allowSetters = true)
    private Set<NoteContent> noteContents = new HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "notes" }, allowSetters = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Note id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getNoteDate() {
        return this.noteDate;
    }

    public Note noteDate(Date noteDate) {
        this.setNoteDate(noteDate);
        return this;
    }

    public void setNoteDate(Date noteDate) {
        this.noteDate = noteDate;
    }

    public Set<NoteContent> getNoteContents() {
        return this.noteContents;
    }

    public void setNoteContents(Set<NoteContent> noteContents) {
        if (this.noteContents != null) {
            this.noteContents.forEach(i -> i.setNote(null));
        }
        if (noteContents != null) {
            noteContents.forEach(i -> i.setNote(this));
        }
        this.noteContents = noteContents;
    }

    public Note noteContents(Set<NoteContent> noteContents) {
        this.setNoteContents(noteContents);
        return this;
    }

    public Note addNoteContent(NoteContent noteContent) {
        this.noteContents.add(noteContent);
        noteContent.setNote(this);
        return this;
    }

    public Note removeNoteContent(NoteContent noteContent) {
        this.noteContents.remove(noteContent);
        noteContent.setNote(null);
        return this;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Note)) {
            return false;
        }
        return id != null && id.equals(((Note) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Note{" +
            "id=" + getId() +
            ", noteDate='" + getNoteDate() + "'" +
            "}";
    }
}
