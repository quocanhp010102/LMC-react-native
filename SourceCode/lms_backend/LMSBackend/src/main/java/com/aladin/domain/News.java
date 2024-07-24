package com.aladin.domain;

import java.io.Serializable;

import java.util.Date;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A News.
 */
@Entity
@Table(name = "news")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class News implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(min = 1, max = 2)
    @Column(name = "news_is_display", length = 2)
    private String news_isDisplay;

    @Column(name = "news_created_date")
    private Date news_created_date;

    @Column(name = "news_display_date")
    private Date news_display_date;

    @Size(min = 1, max = 500)
    @Column(name = "news_title", length = 500)
    private String news_title;

    @Size(min = 1, max = 1000)
    @Column(name = "news_description", length = 1000)
    private String news_description;

    @Size(min = 1, max = 4000)
    @Column(name = "news_content", length = 4000)
    private String news_content;

    @Size(min = 1, max = 400)
    @Column(name = "news_image", length = 400)
    private String news_image;

    public News() {

    }

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public News id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNews_isDisplay() {
        return this.news_isDisplay;
    }

    public News news_isDisplay(String news_isDisplay) {
        this.setNews_isDisplay(news_isDisplay);
        return this;
    }

    public void setNews_isDisplay(String news_isDisplay) {
        this.news_isDisplay = news_isDisplay;
    }

    public Date getNews_created_date() {
        return this.news_created_date;
    }

    public News news_creatd_date(Date news_created_date) {
        this.setNews_created_date(news_created_date);
        return this;
    }

    public void setNews_created_date(Date news_created_date) {
        this.news_created_date = news_created_date;
    }

    public String getNews_title() {
        return this.news_title;
    }

    public News news_title(String news_title) {
        this.setNews_title(news_title);
        return this;
    }

    public void setNews_title(String news_title) {
        this.news_title = news_title;
    }

    public String getNews_description() {
        return this.news_description;
    }

    public News news_description(String news_description) {
        this.setNews_description(news_description);
        return this;
    }

    public void setNews_description(String news_description) {
        this.news_description = news_description;
    }

    public String getNews_content() {
        return this.news_content;
    }

    public News news_content(String news_content) {
        this.setNews_content(news_content);
        return this;
    }

    public String getNews_image() {
        return news_image;
    }

    public void setNews_image(String news_image) {
        this.news_image = news_image;
    }

    public void setNews_content(String news_content) {
        this.news_content = news_content;
    }

    public Date getNews_display_date() {
        return news_display_date;
    }

    public void setNews_display_date(Date news_display_date) {
        this.news_display_date = news_display_date;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here


    public News(Long id, String news_isDisplay, Date news_created_date, Date news_display_date, String news_title, String news_description, String news_content, String news_image) {
        this.id = id;
        this.news_isDisplay = news_isDisplay;
        this.news_created_date = news_created_date;
        this.news_display_date = news_display_date;
        this.news_title = news_title;
        this.news_description = news_description;
        this.news_content = news_content;
        this.news_image = news_image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof News)) {
            return false;
        }
        return id != null && id.equals(((News) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }


    // prettier-ignore


    @Override
    public String toString() {
        return "News{" +
            "id=" + id +
            ", news_isDisplay='" + news_isDisplay + '\'' +
            ", news_created_date=" + news_created_date +
            ", news_display_date=" + news_display_date +
            ", news_title='" + news_title + '\'' +
            ", news_description='" + news_description + '\'' +
            ", news_content='" + news_content + '\'' +
            ", news_image='" + news_image + '\'' +
            '}';
    }
}
