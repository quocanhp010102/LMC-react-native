package com.aladin.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.*;
import static org.hibernate.id.IdentifierGenerator.ENTITY_NAME;

import com.aladin.config.Constants;
import com.aladin.domain.Lecturer;
import com.aladin.domain.Student;
import com.aladin.security.AuthoritiesConstants;
import com.aladin.service.LecturerService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.service.dto.AdminUserDTO;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import com.aladin.service.dto.UserDetailDto;
import com.aladin.service.dto.UserOnlyDTO;
import com.aladin.service.dto.UserRoleDto;
import com.aladin.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing users.
 * <p>
 * This class accesses the {@link } entity, and needs to fetch its collection of authorities.
 * <p>
 * For a normal use-case, it would be better to have an eager relationship between User and Authority,
 * and send everything to the client side: there would be no View Model and DTO, a lot less code, and an outer-join
 * which would be good for performance.
 * <p>
 * We use a View Model and a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities, because people will
 * quite often do relationships with the user, and we don't want them to get the authorities all
 * the time for nothing (for performance reasons). This is the #1 goal: we should not impact our users'
 * application because of this use-case.</li>
 * <li> Not having an outer join causes n+1 requests to the database. This is not a real issue as
 * we have by default a second-level cache. This means on the first HTTP call we do the n+1 requests,
 * but then all authorities come from the cache, so in fact it's much better than doing an outer join
 * (which will get lots of data from the database, for each HTTP call).</li>
 * <li> As this manages users, for security reasons, we'd rather have a DTO layer.</li>
 * </ul>
 * <p>
 * Another option would be to have a specific JPA entity graph to handle this case.
 */
@RestController
@RequestMapping("/api/admin")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;

    private final StudentService studentService;
    private final LecturerService lecturerService;

    public UserResource(UserService userService, StudentService studentService, LecturerService lecturerService) {
        this.userService = userService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
    }

    /**
     * {@code GET /admin/users} : get all users with all the details - calling this are only allowed for the administrators.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @GetMapping("/users")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Page<AdminUserDTO>> getAllUsers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get all User for an admin");

        final Page<AdminUserDTO> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page, headers, HttpStatus.OK);
    }

    /**
     * {@code GET /admin/users/:login} : get the "login" user.
     *
     * @param login the login of the user to find.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the "login" user, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/users/{login}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<AdminUserDTO> getUser(@PathVariable @Pattern(regexp = Constants.LOGIN_REGEX) String login) {
        log.debug("REST request to get User : {}", login);
        return ResponseUtil.wrapOrNotFound(userService.getUserWithAuthoritiesByLogin(login).map(AdminUserDTO::new));
    }

    @GetMapping("/UserByLecAndStudent")
    public ResponseEntity<Map<String, Object>> getAllLecturersByUser(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Lecturers");

        List<UserRoleDto> list = userService.getLecturerByUsers(pageable);
        Integer totalPage = 0;
        if (userService.countUserNotRoleUser()%pageable.getPageSize()!=0){
            totalPage = userService.countUserNotRoleUser()/pageable.getPageSize()+1;
        }
        else{
            totalPage = userService.countUserNotRoleUser()/pageable.getPageSize();
        }
        Map<String, Object> map = new HashMap<>();
        map.put("UserRole", list);
        map.put("totalPage",totalPage);
        return ResponseEntity.ok().body(map);
    }


    @GetMapping("/UserByLecAndStudentAllField")
    public ResponseEntity<Map<String, Object>> getAllLecturersByUserAllField(@org.springdoc.api.annotations.ParameterObject Pageable pageable, @RequestParam("query") String param) {
        log.debug("REST request to get a page of Lecturers");
        Map<String, Object> map = new HashMap<>();
        Integer totalPage = 0;
        if (userService.countUserNotRoleUser(param)%pageable.getPageSize()!=0 && userService.countUserNotRoleUser(param) > pageable.getPageSize()){
            totalPage = userService.countUserNotRoleUser()/pageable.getPageSize()+1;
        }
        else{
            totalPage = userService.countUserNotRoleUser(param)/pageable.getPageSize();
        }
        List<UserRoleDto> list = userService.getUserByLecturerAndStudentAllField(pageable,param);
        map.put("UserRole", list);
        map.put("totalPage",totalPage);
        return ResponseEntity.ok().body(map);
    }

    @GetMapping("/getUserDetail")
    public ResponseEntity<UserDetailDto> getUserDetail(@RequestParam("id") String id, @RequestParam("rolename") String roleName) {
        log.debug("REST request to get a page of Lecturers");
        UserDetailDto userDetailDto = userService.getUserDetail(id, roleName);
        return ResponseEntity.ok().body(userDetailDto);
    }

}
