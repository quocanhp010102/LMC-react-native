package com.aladin.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Admin.
 */
@Entity
@Table(name = "jhi_admin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Admin implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "admin_code", length = 50, nullable = false, unique = true)
    private String admin_code;

    @Column(name = "admin_birthday")
    private LocalDate admin_birthday;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "admin_email", length = 50, nullable = false, unique = true)
    private String admin_email;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "admin_fullname", length = 50, nullable = false)
    private String admin_fullname;

    @Size(min = 1, max = 6)
    @Column(name = "admin_gender", length = 6)
    private String admin_gender;

    @Size(min = 1, max = 50)
    @Column(name = "admin_phone", length = 50)
    private String admin_phone;

    @Size(min = 1, max = 500)
    @Column(name = "admin_avatar", length = 500)
    private String admin_avatar;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here


    public Admin() {
    }

    public Admin(Long id, String admin_code, LocalDate admin_birthday, String admin_email, String admin_fullname, String admin_gender, String admin_phone, String admin_avatar, User user) {
        this.id = id;
        this.admin_code = admin_code;
        this.admin_birthday = admin_birthday;
        this.admin_email = admin_email;
        this.admin_fullname = admin_fullname;
        this.admin_gender = admin_gender;
        this.admin_phone = admin_phone;
        this.admin_avatar = admin_avatar;
        this.user = user;
    }

    public Long getId() {
        return this.id;
    }

    public Admin id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAdmin_code() {
        return this.admin_code;
    }

    public Admin admin_code(String admin_code) {
        this.setAdmin_code(admin_code);
        return this;
    }

    public void setAdmin_code(String admin_code) {
        this.admin_code = admin_code;
    }

    public LocalDate getAdmin_birthday() {
        return this.admin_birthday;
    }

    public Admin admin_birthday(LocalDate admin_birthday) {
        this.setAdmin_birthday(admin_birthday);
        return this;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setAdmin_birthday(LocalDate admin_birthday) {
        this.admin_birthday = admin_birthday;
    }

    public String getAdmin_email() {
        return this.admin_email;
    }

    public Admin admin_email(String admin_email) {
        this.setAdmin_email(admin_email);
        return this;
    }

    public void setAdmin_email(String admin_email) {
        this.admin_email = admin_email;
    }

    public String getAdmin_fullname() {
        return this.admin_fullname;
    }

    public Admin admin_fullname(String admin_fullname) {
        this.setAdmin_fullname(admin_fullname);
        return this;
    }

    public void setAdmin_fullname(String admin_fullname) {
        this.admin_fullname = admin_fullname;
    }

    public String getAdmin_gender() {
        return this.admin_gender;
    }

    public Admin admin_gender(String admin_gender) {
        this.setAdmin_gender(admin_gender);
        return this;
    }

    public void setAdmin_gender(String admin_gender) {
        this.admin_gender = admin_gender;
    }

    public String getAdmin_phone() {
        return this.admin_phone;
    }

    public Admin admin_phone(String admin_phone) {
        this.setAdmin_phone(admin_phone);
        return this;
    }

    public void setAdmin_phone(String admin_phone) {
        this.admin_phone = admin_phone;
    }

    public String getAdmin_avatar() {
        return this.admin_avatar;
    }

    public Admin admin_avatar(String admin_avatar) {
        this.setAdmin_avatar(admin_avatar);
        return this;
    }

    public void setAdmin_avatar(String admin_avatar) {
        this.admin_avatar = admin_avatar;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Admin)) {
            return false;
        }
        return id != null && id.equals(((Admin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Admin{" +
            "id=" + getId() +
            ", admin_code='" + getAdmin_code() + "'" +
            ", admin_birthday='" + getAdmin_birthday() + "'" +
            ", admin_email='" + getAdmin_email() + "'" +
            ", admin_fullname='" + getAdmin_fullname() + "'" +
            ", admin_gender='" + getAdmin_gender() + "'" +
            ", admin_phone='" + getAdmin_phone() + "'" +
            ", admin_avatar='" + getAdmin_avatar() + "'" +
            "}";
    }
}
