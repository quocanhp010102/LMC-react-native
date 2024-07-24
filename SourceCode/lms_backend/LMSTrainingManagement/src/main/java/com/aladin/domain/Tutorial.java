package com.aladin.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Tutorial.
 */
@Entity
@Table(name = "tutorial")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Document(indexName = "tutorial230")
public class Tutorial implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    @Field(type = FieldType.Keyword)
    private Long id;

    @Size(min = 1, max = 500)
    @Column(name = "tutorial_title", length = 500)
    private String tutorial_title;

    @NotNull
    @Size(min = 1, max = 500)
    @Column(name = "tutorial_video", length = 500, nullable = false)
    private String tutorial_video;

    @NotNull
    @CreatedDate
    @Column(name = "tutorial_created_date", nullable = false)
    private Date tutorial_createdDate = new Date();

    @Size(min = 1, max = 2)
    @Column(name = "tutorial_is_display", length = 2)
    private String tutorial_isDisplay = "0";

    @Column(name = "tutorial_image")
    private String tutorial_image;

    @ManyToMany(fetch = FetchType.EAGER)
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

    public Date getTutorial_createdDate() {
        return this.tutorial_createdDate;
    }

    public Tutorial tutorial_createdDate(Date tutorial_createdDate) {
        this.setTutorial_createdDate(tutorial_createdDate);
        return this;
    }

    public void setTutorial_createdDate(Date tutorial_createdDate) {
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

    public String getTutorial_image() {
        return tutorial_image;
    }

    public void setTutorial_image(String tutorial_image) {
        this.tutorial_image = tutorial_image;
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
            ", tutorial_image='" + tutorial_image + '\'' +
            ", authorities=" + authorities +
            '}';
    }
}
