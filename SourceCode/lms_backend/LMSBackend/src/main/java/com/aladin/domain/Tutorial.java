package com.aladin.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A Tutorial.
 */
@Entity
@Table(name = "tutorial")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Tutorial implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(min = 1, max = 500)
    @Column(name = "tutorial_title", length = 500)
    private String tutorial_title;

    @NotNull
    @Size(min = 1, max = 500)
    @Column(name = "tutorial_video", length = 500, nullable = false)
    private String tutorial_video;

    @NotNull
    @Column(name = "tutorial_created_date", nullable = false)
    private LocalDate tutorial_createdDate;

    @Size(min = 1, max = 2)
    @Column(name = "tutorial_is_display", length = 2)
    private String tutorial_isDisplay;

    @ManyToMany
    @JoinTable(joinColumns = @JoinColumn(name = "tutorial_id"),
        inverseJoinColumns = @JoinColumn(name = "authority_name")
    )
    private Set<Authority> authorities;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Tutorial id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTutorial_title() {
        return this.tutorial_title;
    }

    public Tutorial tutorial_title(String tutorial_title) {
        this.setTutorial_title(tutorial_title);
        return this;
    }

    public void setTutorial_title(String tutorial_title) {
        this.tutorial_title = tutorial_title;
    }

    public String getTutorial_video() {
        return this.tutorial_video;
    }

    public Tutorial tutorial_video(String tutorial_video) {
        this.setTutorial_video(tutorial_video);
        return this;
    }

    public void setTutorial_video(String tutorial_video) {
        this.tutorial_video = tutorial_video;
    }

    public LocalDate getTutorial_createdDate() {
        return this.tutorial_createdDate;
    }

    public Tutorial tutorial_createdDate(LocalDate tutorial_createdDate) {
        this.setTutorial_createdDate(tutorial_createdDate);
        return this;
    }

    public void setTutorial_createdDate(LocalDate tutorial_createdDate) {
        this.tutorial_createdDate = tutorial_createdDate;
    }

    public String getTutorial_isDisplay() {
        return this.tutorial_isDisplay;
    }

    public Tutorial tutorial_isDisplay(String tutorial_isDisplay) {
        this.setTutorial_isDisplay(tutorial_isDisplay);
        return this;
    }

    public void setTutorial_isDisplay(String tutorial_isDisplay) {
        this.tutorial_isDisplay = tutorial_isDisplay;
    }

    public Set<Authority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
    }


    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tutorial)) {
            return false;
        }
        return id != null && id.equals(((Tutorial) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "Tutorial{" +
            "id=" + id +
            ", tutorial_title='" + tutorial_title + '\'' +
            ", tutorial_video='" + tutorial_video + '\'' +
            ", tutorial_createdDate=" + tutorial_createdDate +
            ", tutorial_isDisplay='" + tutorial_isDisplay + '\'' +
            ", authorities=" + authorities +
            '}';
    }
}
