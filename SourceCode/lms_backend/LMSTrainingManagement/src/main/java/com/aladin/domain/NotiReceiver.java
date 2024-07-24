package com.aladin.domain;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A NotiReceiver.
 */
@Entity
@Table(name = "noti_receiver")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class NotiReceiver implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "noti_receiver_status")
    private String notiReceiverStatus;

    @ManyToOne
    private Notification notification;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "notifications", "notificationsOfSender" }, allowSetters = true)
    private User receiver;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NotiReceiver id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotiReceiverStatus() {
        return this.notiReceiverStatus;
    }

    public NotiReceiver notiReceiverStatus(String notiReceiverStatus) {
        this.setNotiReceiverStatus(notiReceiverStatus);
        return this;
    }

    public void setNotiReceiverStatus(String notiReceiverStatus) {
        this.notiReceiverStatus = notiReceiverStatus;
    }

    public Notification getNotification() {
        return this.notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }

    public NotiReceiver notification(Notification notification) {
        this.setNotification(notification);
        return this;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NotiReceiver)) {
            return false;
        }
        return id != null && id.equals(((NotiReceiver) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NotiReceiver{" +
            "id=" + getId() +
            ", notiReceiverStatus='" + getNotiReceiverStatus() + "'" +
            "}";
    }
}
