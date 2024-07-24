package com.aladin.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Notification.
 */
@Entity
@Table(name = "notification")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Notification implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "notification_title", nullable = false)
    private String notificationTitle;

    @NotNull
    @Column(name = "notification_content", nullable = false)
    private String notificationContent;

    @Column(name = "notification_time", nullable = false)
    private Date notificationTime;


//    @ManyToOne(fetch = FetchType.LAZY)
//    @JsonIgnoreProperties(value = { "notifications", "notificationsOfSender" }, allowSetters = true)
//    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "notifications", "notificationsOfSender" }, allowSetters = true)
    private User sender;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(joinColumns = @JoinColumn(name = "notification_id"),
        inverseJoinColumns = @JoinColumn(name = "authority_name")
    )
    private Set<Authority> authorities;

    @OneToMany(mappedBy = "notification",fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "note", "exams","notification" }, allowSetters = true)
    private Set<NoteContent> noteContents = new HashSet<>();



    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Notification id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotificationContent() {
        return this.notificationContent;
    }

    public Notification notificationContent(String notificationContent) {
        this.setNotificationContent(notificationContent);
        return this;
    }



    public void setNotificationContent(String notificationContent) {
        this.notificationContent = notificationContent;
    }

    public Date getNotificationTime() {
        return this.notificationTime;
    }

    public Notification notificationTime(Date notificationTime) {
        this.setNotificationTime(notificationTime);
        return this;
    }

    public void setNotificationTime(Date notificationTime) {
        this.notificationTime = notificationTime;
    }


    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public Set<Authority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
    }

    public String getNotificationTitle() {
        return notificationTitle;
    }

    public void setNotificationTitle(String notificationTitle) {
        this.notificationTitle = notificationTitle;
    }

    public Set<NoteContent> getNoteContents() {
        return noteContents;
    }

    public void setNoteContents(Set<NoteContent> noteContents) {
        this.noteContents = noteContents;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Notification)) {
            return false;
        }
        return id != null && id.equals(((Notification) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore


    @Override
    public String toString() {
        return "Notification{" +
            "id=" + id +
            ", notificationTitle='" + notificationTitle + '\'' +
            ", notificationContent='" + notificationContent + '\'' +
            ", notificationTime=" + notificationTime +
            '}';
    }
}
