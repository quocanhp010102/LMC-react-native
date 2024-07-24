package com.aladin.service;

import com.aladin.config.Constants;
import com.aladin.domain.*;
import com.aladin.repository.*;
import com.aladin.repository.search.UserSearchRepository;
import com.aladin.security.SecurityUtils;
import com.aladin.service.dto.*;

import java.security.Principal;
import java.sql.*;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final AuthorityRepository authorityRepository;

    private final CacheManager cacheManager;

    private final LecturerRepository lecturerRepository;

    private final StudentRepository studentRepository;

    private final AdminRepository adminRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    public UserService(UserRepository userRepository, UserSearchRepository userSearchRepository, AuthorityRepository authorityRepository, CacheManager cacheManager, LecturerRepository lecturerRepository, StudentRepository studentRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.authorityRepository = authorityRepository;
        this.cacheManager = cacheManager;
        this.lecturerRepository = lecturerRepository;
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
    }

    /**
     * Update basic information (first name, last name, email, language) for the current user.
     *
     * @param firstName first name of user.
     * @param lastName  last name of user.
     * @param email     email id of user.
     * @param langKey   language key.
     * @param imageUrl  image URL of user.
     */
    public void updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
        SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneByLogin).ifPresent(user -> {
            user.setFirstName(firstName);
            user.setLastName(lastName);
            if (email != null) {
                user.setEmail(email.toLowerCase());
            }
            user.setLangKey(langKey);
            user.setImageUrl(imageUrl);
//                userSearchRepository.save(user);
            this.clearUserCaches(user);
            log.debug("Changed Information for User: {}", user);
        });
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(AdminUserDTO::new);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllPublicUsers(Pageable pageable) {
        return userRepository.findAllByIdNotNullAndActivatedIsTrue(pageable).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    /**
     * Gets a list of all the authorities.
     *
     * @return a list of all the authorities.
     */
    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }

    private User syncUserWithIdP(Map<String, Object> details, User user) {

        log.info("User before syn: "+user.toString());
        try {
            // save authorities in to sync user roles/groups between IdP and JHipster's local database
            Collection<String> dbAuthorities = getAuthorities();
            Collection<String> userAuthorities = user.getAuthorities().stream().map(Authority::getName).collect(Collectors.toList());
            for (String authority : userAuthorities) {
                if (!dbAuthorities.contains(authority)) {
                    log.debug("Saving authority '{}' in local database", authority);
                    Authority authorityToSave = new Authority();
                    authorityToSave.setName(authority);
                    authorityRepository.save(authorityToSave);
                }
            }
            // save account in to sync users between IdP and JHipster's local database
            Optional<User> existingUser = userRepository.findOneByLogin(user.getLogin());
            if (existingUser.isPresent()) {
                log.info("existingUser: "+existingUser.get().toString());
                // if IdP sends last updated information, use it to determine if an update should happen
                if (details.get("updated_at") != null) {
                    Instant dbModifiedDate = existingUser.get().getLastModifiedDate();
                    Instant idpModifiedDate = (Instant) details.get("updated_at");
                    if (idpModifiedDate.isAfter(dbModifiedDate)) {
                        log.debug("Updating user '{}' in local database", user.getLogin());
                        updateUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getLangKey(), user.getImageUrl());
                    }
                    // no last updated info, blindly update
                } else {
                    log.debug("Updating user '{}' in local database", user.getLogin());
                    updateUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getLangKey(), user.getImageUrl());
                }
            } else {
                log.debug("Saving user '{}' in local database", user.getLogin());
                log.info("user before save: " + user.getId());
                user.setId(user.getId().replaceAll("[^0-9.]", ""));
                userRepository.save(user);
                log.info("user after save: " + user.getId());
                this.clearUserCaches(user);
            }
            log.warn("user Syn: " + user.getAuthorities());
            for (String authority : userAuthorities) {
                //role student
                if (authority.equals("ROLE_STUDENT")) {
                    //check lecturer
                    if (lecturerRepository.countLecturer(user.getId()) == 1 && lecturerRepository.countLecturerByRole(user.getId()) == 1) {
                        lecturerRepository.deleteLecturerByUser(user.getId());
                    }
                    userRepository.deleteUserWithRole(user.getId(), "ROLE_LECTURER");

                    //check admin
                    if (userRepository.countAdminByRole(user.getId()) == 1 && userRepository.countAdmin(user.getId()) == 1) {
                        userRepository.deleteUserWithRole(user.getId(), "ROLE_ADMIN");
                    }
                    userRepository.deleteUserWithRole(user.getId(), "ROLE_ADMIN");

                    //insert if not exist
                    if (studentRepository.countStudent(user.getId()) == 0) {
                        Student student = new Student();
                        student.setStudent_email(user.getEmail());
                        student.setStudent_fullname(user.getFirstName() + " " + user.getLastName());
                        int index = user.getEmail().indexOf("@");
                        String studentCode = user.getLogin().substring(index - 6, index);
                        student.setStudent_code(studentCode);
                        student.setUser(user);
                        studentRepository.save(student);
                        log.info("user_id_insert: " + user.getId());
                        if (studentRepository.countStudentByRole(user.getId()) == 0) {
                            userRepository.insertUserWithRole(user.getId(), "ROLE_STUDENT");
                        }
                    }
                }
                //role lecturer
                if (authority.equals("ROLE_LECTURER")) {
                    //check student
                    if (studentRepository.countStudent(user.getId()) == 1 && studentRepository.countStudentByRole(user.getId()) == 1) {
                        studentRepository.deleteStudentByUser(user.getId());
                    }
                    userRepository.deleteUserWithRole(user.getId(), "ROLE_STUDENT");

                    //check admin
                    if (userRepository.countAdminByRole(user.getId()) == 1 && userRepository.countAdmin(user.getId()) == 1) {
                        userRepository.deleteUserWithRole(user.getId(), "ROLE_ADMIN");
                    }
                    userRepository.deleteUserWithRole(user.getId(), "ROLE_ADMIN");

                    if (lecturerRepository.countLecturer(user.getId()) == 0) {
                        log.info("user_id_insert_lecturer: " + user.getId());
                        Lecturer lecturer = new Lecturer();
                        lecturer.setLecturer_email(user.getEmail());
                        lecturer.setLecturer_fullname(user.getFirstName() + " " + user.getLastName());
                        int index = user.getEmail().indexOf("@");
                        String lecturerCode = user.getLogin().substring(index - 6, index);
                        lecturer.setLecturer_code(lecturerCode);
                        lecturer.setUser(user);
                        lecturerRepository.save(lecturer);
                        if (lecturerRepository.countLecturerByRole(user.getId()) == 0) {
                            userRepository.insertUserWithRole(user.getId(), "ROLE_LECTURER");
                        }
                    }

                }
                //role ADMIN
                if (authority.equals("ROLE_ADMIN")) {
                    //check student
                    if (studentRepository.countStudent(user.getId()) == 1 && studentRepository.countStudentByRole(user.getId()) == 1) {
                        studentRepository.deleteStudentByUser(user.getId());
                    }
                    userRepository.deleteUserWithRole(user.getId(), "ROLE_STUDENT");

                    //check lecturer
                    if (lecturerRepository.countLecturer(user.getId()) == 1 && lecturerRepository.countLecturerByRole(user.getId()) == 1) {
                        lecturerRepository.deleteLecturerByUser(user.getId());
                    }
                    userRepository.deleteUserWithRole(user.getId(), "ROLE_LECTURER");

                    //check if exist
                    if (userRepository.countAdmin(user.getId()) == 0) {
                        log.info("user_id_insert_admin: " + user.getId());
                        Admin admin = new Admin();
                        admin.setAdmin_email(user.getEmail());
                        admin.setAdmin_fullname(user.getFirstName() + " " + user.getLastName());
                        int index = user.getEmail().indexOf("@");
                        String adminCode = "";
                        if (index >= 0 && index <= 5) {
                            adminCode = user.getLogin().substring(0, index);
                        } else {
                            adminCode = user.getLogin().substring(index - 6, index);
                        }
                        admin.setAdmin_code(adminCode);
                        admin.setUser(user);
                        adminRepository.save(admin);
                        if (userRepository.countAdminByRole(user.getId()) == 0) {
                            userRepository.insertUserWithRole(user.getId(), "ROLE_ADMIN");
                        }
                    }

                }
            }

            return user;
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            log.error("Error user:" + user.getId());
        }
        return null;

    }

    /**
     * Returns the user from an OAuth 2.0 login or resource server with JWT.
     * Synchronizes the user in the local repository.
     *
     * @param authToken the authentication token.
     * @return the user from the authentication.
     */
    @Transactional
//    @Cacheable(value = "getUserFromAuthentication")
    public AdminUserDTO getUserFromAuthentication(AbstractAuthenticationToken authToken) {
        Map<String, Object> attributes;
        if (authToken instanceof OAuth2AuthenticationToken) {
            attributes = ((OAuth2AuthenticationToken) authToken).getPrincipal().getAttributes();
        } else if (authToken instanceof JwtAuthenticationToken) {
            attributes = ((JwtAuthenticationToken) authToken).getTokenAttributes();
        } else {
            throw new IllegalArgumentException("AuthenticationToken is not OAuth2 or JWT!");
        }

        User user = getUser(attributes);

        log.debug("user dang login: " + user.getId());
        user.setId(user.getId().replaceAll("[^0-9.]", ""));
        log.debug("user dang login sau khi sua: " + user.getId());

        user.setAuthorities(authToken.getAuthorities().stream().map(GrantedAuthority::getAuthority).map(authority -> {
            Authority auth = new Authority();
            auth.setName(authority);
            return auth;
        }).collect(Collectors.toSet()));

        log.warn("user getUserFromAuthentication: " + user.getAuthorities());

        return new AdminUserDTO(syncUserWithIdP(attributes, user));
    }

    private static User getUser(Map<String, Object> details) {
        User user = new User();
        Boolean activated = Boolean.TRUE;
        String sub = String.valueOf(details.get("sub"));
        String username = null;
        if (details.get("preferred_username") != null) {
            username = ((String) details.get("preferred_username")).toLowerCase();
        }
        // handle resource server JWT, where sub claim is email and uid is ID
        if (details.get("uid") != null) {
            String uID = ((String) details.get("uid"));
            user.setId(uID.replaceAll("[^0-9.]", ""));
            user.setLogin(sub);
        } else {
            user.setId(sub);
        }
        if (username != null) {
            user.setLogin(username);
        } else if (user.getLogin() == null) {
            user.setLogin(user.getId());
        }
        if (details.get("given_name") != null) {
            user.setFirstName((String) details.get("given_name"));
        } else if (details.get("name") != null) {
            user.setFirstName((String) details.get("name"));
        }
        if (details.get("family_name") != null) {
            user.setLastName((String) details.get("family_name"));
        }
        if (details.get("email_verified") != null) {
            activated = (Boolean) details.get("email_verified");
        }
        if (details.get("email") != null) {
            user.setEmail(((String) details.get("email")).toLowerCase());
            log.warn("email: " + ((String) details.get("email")).toLowerCase());
        } else if (sub.contains("|") && (username != null && username.contains("@"))) {
            // special handling for Auth0
            user.setEmail(username);
        } else {
            user.setEmail(sub);
        }
        if (details.get("langKey") != null) {
            user.setLangKey((String) details.get("langKey"));
        } else if (details.get("locale") != null) {
            // trim off country code if it exists
            String locale = (String) details.get("locale");
            if (locale.contains("_")) {
                locale = locale.substring(0, locale.indexOf('_'));
            } else if (locale.contains("-")) {
                locale = locale.substring(0, locale.indexOf('-'));
            }
            user.setLangKey(locale.toLowerCase());
        } else {
            // set langKey to default if not specified by IdP
            user.setLangKey(Constants.DEFAULT_LANGUAGE);
        }
        if (details.get("picture") != null) {
            user.setImageUrl((String) details.get("picture"));
        }
        user.setActivated(activated);
        return user;
    }

    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE)).evict(user.getLogin());
        if (user.getEmail() != null) {
            Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE)).evict(user.getEmail());
        }
    }

    public Boolean checkIsAdmin(String user_id) {
        if (userRepository.countAdminByRole(user_id) == 1 && userRepository.countAdmin(user_id) == 1) {
            return true;
        } else {
            return false;
        }
    }


    public String getUserID(Principal principal) {
        String userid = getUserFromAuthentication((AbstractAuthenticationToken) principal).getId();
        log.info("user_id: " + userid);
        userid = userid.replaceAll("[^0-9.]", "");
//        if (userid.length() > 19) {
//            userid = userid.substring(0, 19);
//        }
        return userid;
    }


    public User findOneByLogin(String login) {
        return userRepository.findOneUserByLogin(login);
    }

    public User getUserByID(String id) {
        return userRepository.getUserByID(id);
    }

    //    @Cacheable(value = "getLecturerUser")
    @Transactional
    public List<UserRoleDto> getLecturerByUsers(Pageable pageable) {
        String sql = "  select s.student_code as id, u.login as login, jhi.authority_name as role, s.student_fullname as fullname\n" +
            "            from STUDENT s inner join JHI_USER u on u.ID = s.USER_ID\n" +
            "            inner join jhi_user_authority jhi on jhi.user_id=u.id\n" +
            "            where jhi.authority_name !='ROLE_USER' AND jhi.authority_name !='ROLE_LECTURER'\n" +
            "            UNION\n" +
            "            select s.lecturer_code as id, u.login as login,  jhi.authority_name as role,s.lecturer_fullname as fullname\n" +
            "            from LECTURER s inner join JHI_USER u on u.ID = s.USER_ID\n" +
            "            inner join jhi_user_authority jhi on jhi.user_id=u.id\n" +
            "            where jhi.authority_name !='ROLE_USER'" +
            "   OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";


        return jdbcTemplate.query(sql, new Object[]{pageable.getPageNumber() * pageable.getPageSize(), pageable.getPageSize()}, (rs, rowNum) ->
            new UserRoleDto(
                rs.getString("id"),
                rs.getString("login"),
                rs.getString("fullname"),
                rs.getString("role")
            ));
    }

    //    @Cacheable(value = "getUserAllField")
    @Transactional
    public List<UserRoleDto> getUserByLecturerAndStudentAllField(Pageable pageable, String param) {

        String sql = "select s.student_code as id, u.login as login, jhi.authority_name as role, s.student_fullname as fullname\n" +
            "            from STUDENT s inner join JHI_USER u on u.ID = s.USER_ID\n" +
            "            inner join jhi_user_authority jhi on jhi.user_id=u.id\n" +
            "            where jhi.authority_name !='ROLE_USER' AND jhi.authority_name !='ROLE_LECTURER'\n" +
            "            and(s.student_code like ? or u.login like ? or jhi.authority_name like ? or s.student_fullname like ?)\n" +
            "            UNION\n" +
            "            select s.lecturer_code as id, u.login as login,  jhi.authority_name as role ,s.lecturer_fullname as fullname\n" +
            "            from LECTURER s inner join JHI_USER u on u.ID = s.USER_ID\n" +
            "            inner join jhi_user_authority jhi on jhi.user_id=u.id\n" +
            "            where jhi.authority_name !='ROLE_USER' \n" +
            "            and(s.lecturer_code like ? or u.login like ? or jhi.authority_name like ? or s.lecturer_fullname like ?)" +
            "   OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";
        return jdbcTemplate.query(sql, new Object[]{"%" + param + "%", "%" + param + "%", "%" + param + "%", "%" + param + "%", "%" + param + "%", "%" + param + "%", "%" + param + "%", "%" + param + "%", pageable.getPageNumber() * pageable.getPageSize(), pageable.getPageSize()}, (rs, rowNum) ->
            new UserRoleDto(
                rs.getString("id"),
                rs.getString("login"),
                rs.getString("fullname"),
                rs.getString("role")
            ));
    }

    public int countUserNotRoleUser() {
        return userRepository.countUserNotRoleUser();
    }

    public int countUserNotRoleUser(String param) {
        param = "%" + param + "%";
        return userRepository.countUserNotRoleUser(param);
    }

    //    @Cacheable(value = "getUserDetail")
    @Transactional
    public UserDetailDto getUserDetail(String id, String roleName) {

        UserDetailDto userDetailDto = new UserDetailDto();
        if (roleName.equalsIgnoreCase("ROLE_STUDENT")) {
            Student student = studentRepository.getStudentsByStudentCode(id);
            userDetailDto.setUserCode(student.getStudent_code());
            userDetailDto.setSex(student.getStudent_gender());
            userDetailDto.setNumPhone(student.getStudent_phone());
            userDetailDto.setEmail(student.getStudent_email());
            userDetailDto.setBirthDay(student.getStudent_birthday());
            userDetailDto.setRole(roleName);
            userDetailDto.setFullname(student.getStudent_fullname());
            student.getClassroomStudents().forEach(p -> {
                userDetailDto.setClassName(userDetailDto.getClassName() + p.getClassroom().getClassroomName() + ",");
            });
        } else if (roleName.equalsIgnoreCase("ROLE_LECTURER")) {
            Lecturer lecturer = lecturerRepository.getLecturerByLecturerCode(id);
            userDetailDto.setUserCode(lecturer.getLecturer_code());
            userDetailDto.setSex(lecturer.getLecturer_gender());
            userDetailDto.setNumPhone(lecturer.getLecturer_phone());
            userDetailDto.setEmail(lecturer.getLecturer_email());
            userDetailDto.setBirthDay(lecturer.getLecturer_birthday());
            userDetailDto.setFullname(lecturer.getLecturer_fullname());
            userDetailDto.setRole(roleName);
            userDetailDto.setClassName(null);
        }
        return userDetailDto;
    }
}
