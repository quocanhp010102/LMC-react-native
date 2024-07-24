package com.aladin.config;

import java.net.URI;
import java.util.concurrent.TimeUnit;
import javax.cache.configuration.MutableConfiguration;
import javax.cache.expiry.CreatedExpiryPolicy;
import javax.cache.expiry.Duration;

import org.hibernate.cache.jcache.ConfigSettings;
import org.redisson.Redisson;
import org.redisson.config.ClusterServersConfig;
import org.redisson.config.Config;
import org.redisson.config.SingleServerConfig;
import org.redisson.jcache.configuration.RedissonConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.serviceregistry.Registration;
import org.springframework.context.annotation.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
@Primary
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;

    @Bean
    public javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration(JHipsterProperties jHipsterProperties) {
        MutableConfiguration<Object, Object> jcacheConfig = new MutableConfiguration<>();

        URI redisUri = URI.create(jHipsterProperties.getCache().getRedis().getServer()[0]);

        Config config = new Config();
        if (jHipsterProperties.getCache().getRedis().isCluster()) {
            ClusterServersConfig clusterServersConfig = config
                .useClusterServers()
                .setMasterConnectionPoolSize(jHipsterProperties.getCache().getRedis().getConnectionPoolSize())
                .setMasterConnectionMinimumIdleSize(jHipsterProperties.getCache().getRedis().getConnectionMinimumIdleSize())
                .setSubscriptionConnectionPoolSize(jHipsterProperties.getCache().getRedis().getSubscriptionConnectionPoolSize())
                .addNodeAddress(jHipsterProperties.getCache().getRedis().getServer());

            if (redisUri.getUserInfo() != null) {
                clusterServersConfig.setPassword(redisUri.getUserInfo().substring(redisUri.getUserInfo().indexOf(':') + 1));
            }
        } else {
            SingleServerConfig singleServerConfig = config
                .useSingleServer()
                .setConnectionPoolSize(jHipsterProperties.getCache().getRedis().getConnectionPoolSize())
                .setConnectionMinimumIdleSize(jHipsterProperties.getCache().getRedis().getConnectionMinimumIdleSize())
                .setSubscriptionConnectionPoolSize(jHipsterProperties.getCache().getRedis().getSubscriptionConnectionPoolSize())
                .setAddress(jHipsterProperties.getCache().getRedis().getServer()[0]);

            if (redisUri.getUserInfo() != null) {
                singleServerConfig.setPassword(redisUri.getUserInfo().substring(redisUri.getUserInfo().indexOf(':') + 1));
            }
        }
        jcacheConfig.setStatisticsEnabled(true);
        jcacheConfig.setExpiryPolicyFactory(
            CreatedExpiryPolicy.factoryOf(new Duration(TimeUnit.SECONDS, jHipsterProperties.getCache().getRedis().getExpiration()))
        );
        return RedissonConfiguration.fromInstance(Redisson.create(config), jcacheConfig);
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cm) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cm);
    }

    @Bean
    @Primary
    public JCacheManagerCustomizer cacheManagerCustomizer(javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration) {
        return cm -> {
            createCache(cm, com.aladin.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            createCache(cm, com.aladin.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            createCache(cm, com.aladin.domain.User.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Authority.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            createCache(cm, com.aladin.domain.Department.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Lesson.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Student.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Lecturer.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.FilesOfCourse.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Course.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.CourseStudent.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.StudentLesson.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Answers.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Exams.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.ExamsHistory.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Questions.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.TypeOfExams.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.FilesOfLesson.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Note.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.NoteContent.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.History.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.News.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Tutorial.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.QuestionAndAnswer.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.ActivityHistory.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Classroom.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.ClassroomStudent.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.StudentExam.class.getName(), jcacheConfiguration);
            createCache(cm, com.aladin.domain.Admin.class.getName(), jcacheConfiguration);
//            createCache(cm, "findHighlightDepartment", jcacheConfiguration);
//            createCache(cm, "findAllDepartment", jcacheConfiguration);
//            createCache(cm, "getUserID", jcacheConfiguration);
//            createCache(cm, "findAllCourse", jcacheConfiguration);
//            createCache(cm, "findCourseByCurrentStudent", jcacheConfiguration);
//            createCache(cm, "findAllLesson", jcacheConfiguration);
//            createCache(cm, "findLessonByCourse", jcacheConfiguration);
//            createCache(cm, "findAllStudent", jcacheConfiguration);
//            createCache(cm, "findStudentByCourse", jcacheConfiguration);
//            createCache(cm, "findAllClassroom", jcacheConfiguration);
//            createCache(cm, "findAllLecturer", jcacheConfiguration);
//            createCache(cm, "findAllAdmin", jcacheConfiguration);
//            createCache(cm, "findAdminByUser", jcacheConfiguration);
//            createCache(cm, "getUserDetail", jcacheConfiguration);
//            createCache(cm, "getUserAllField", jcacheConfiguration);
//            createCache(cm, "getLecturerUser", jcacheConfiguration);
//            createCache(cm, "getUserFromAuthentication", jcacheConfiguration);
//            createCache(cm, "findAllStudentLesson", jcacheConfiguration);
//            createCache(cm, "findDepartmentByType", jcacheConfiguration);
//            createCache(cm, "findLecturerMySelf", jcacheConfiguration);
//            createCache(cm, "findUpdateAdmin", jcacheConfiguration);
//            createCache(cm, "findUpdateAdmin", jcacheConfiguration);
//            createCache(cm, "findUpdateClassroom", jcacheConfiguration);
//            createCache(cm, "findCourseByDepartment", jcacheConfiguration);
//            createCache(cm, "findAllClassroomStudent", jcacheConfiguration);
//            createCache(cm, "findAllStudentByClass", jcacheConfiguration);
//            createCache(cm, "findAllClassroomByDepartment", jcacheConfiguration);
//            createCache(cm, "findCourseByLecturer", jcacheConfiguration);
//            createCache(cm, "getCoursesByLectureId", jcacheConfiguration);
//            createCache(cm, "getCoursesByLectureId", jcacheConfiguration);
//            createCache(cm, "getCourseDetailByDepartment", jcacheConfiguration);
//            createCache(cm, "findAllCourseStudent", jcacheConfiguration);
//            createCache(cm, "findCourseStudentByCourse", jcacheConfiguration);
//            createCache(cm, "getCourseManager", jcacheConfiguration);
//            createCache(cm, "gerCourseStudentPercentHistory", jcacheConfiguration);
//            createCache(cm, "gerCourseLecturerPercentHistory", jcacheConfiguration);
//            createCache(cm, "getFilesOfCourseByCourse", jcacheConfiguration);
//            createCache(cm, "findAllFileOfCourse", jcacheConfiguration);
//            createCache(cm, "getFilesOfLessonByLesson", jcacheConfiguration);
//            createCache(cm, "findAllFilesOfLesson", jcacheConfiguration);
//            createCache(cm, "findStudentMySelf", jcacheConfiguration);
//            createCache(cm, "getStudentsByCoursesId", jcacheConfiguration);
//            createCache(cm, "getAllStudentByClassCode", jcacheConfiguration);
//            createCache(cm, "getStudentsOnClass", jcacheConfiguration);
//            createCache(cm, "findAllDungTQ", jcacheConfiguration);




            // jhipster-needle-redis-add-entry
        };
    }

    private void createCache(
        javax.cache.CacheManager cm,
        String cacheName,
        javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration
    ) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
