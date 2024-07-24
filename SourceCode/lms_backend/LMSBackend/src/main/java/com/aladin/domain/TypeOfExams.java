package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A TypeOfExams.
 */
@Entity
@Table(name = "type_of_exams")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TypeOfExams implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "type_of_exams_name")
    private String typeOfExamsName;

    @OneToMany(mappedBy = "typeOfExams")
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "questions", "typeOfExams" }, allowSetters = true)
    private Set<Exams> exams = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TypeOfExams id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeOfExamsName() {
        return this.typeOfExamsName;
    }

    public TypeOfExams typeOfExamsName(String typeOfExamsName) {
        this.setTypeOfExamsName(typeOfExamsName);
        return this;
    }

    public void setTypeOfExamsName(String typeOfExamsName) {
        this.typeOfExamsName = typeOfExamsName;
    }

    public Set<Exams> getExams() {
        return this.exams;
    }

    public void setExams(Set<Exams> exams) {
        if (this.exams != null) {
            this.exams.forEach(i -> i.setTypeOfExams(null));
        }
        if (exams != null) {
            exams.forEach(i -> i.setTypeOfExams(this));
        }
        this.exams = exams;
    }

    public TypeOfExams exams(Set<Exams> exams) {
        this.setExams(exams);
        return this;
    }

    public TypeOfExams addExams(Exams exams) {
        this.exams.add(exams);
        exams.setTypeOfExams(this);
        return this;
    }

    public TypeOfExams removeExams(Exams exams) {
        this.exams.remove(exams);
        exams.setTypeOfExams(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypeOfExams)) {
            return false;
        }
        return id != null && id.equals(((TypeOfExams) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeOfExams{" +
            "id=" + getId() +
            ", typeOfExamsName='" + getTypeOfExamsName() + "'" +
            "}";
    }
}
