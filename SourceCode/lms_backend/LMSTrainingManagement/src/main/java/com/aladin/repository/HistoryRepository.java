package com.aladin.repository;

import com.aladin.domain.History;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the History entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {

    @Query(value = "select \n" +
        "        id,\n" +
        "        HISTORY_NAME,\n" +
        "        (SELECT TO_CHAR (TRUNC (SYSDATE) + NUMTODSINTERVAL (\n" +
        "        (24 *60*60* (TO_DATE((select to_char(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM DUAL), 'YYYY-MM-DD HH24:MI:SS')-to_date(HISTORY_time,'YYYY-MM-DD HH24:MI:SS')))\n" +
        "        , 'second'),\n" +
        "                        'hh24:mi:ss'\n" +
        "                       ) hr\n" +
        "          FROM DUAL\n" +
        "        ) HISTORY_TIME,\n" +
        "        null COURSE_ID,\n" +
        "        null LESSON_ID,\n" +
        "        USER_ID\n" +
        "        from HISTORY \n" +
        "        where\n" +
        "        (\n" +
        "        TO_DATE((select to_char(SYSDATE, 'YYYY-MM-DD ') FROM DUAL), 'YYYY-MM-DD ')\n" +
        "        =\n" +
        "        to_date(\n" +
        "        to_char(\n" +
        "          to_date(HISTORY_time,'YYYY-MM-DD HH24:MI:SS'),'YYYY-MM-DD'\n" +
        "          ),\n" +
        "          'YYYY-MM-DD '\n" +
        "          )\n" +
        "        )\n" +
        "        AND\n" +
        "        user_id =(select id from jhi_user where login=:login)  ORDER BY HISTORY_TIME asc  offset :start rows fetch next :limit rows only",
    nativeQuery = true)
    List<History> findAllByDateAndLogin(@Param("login") String login, @Param("start") Long start, @Param("limit") Integer limit);

    @Query(value = "select \n" +
        "       count(*)\n" +
        "        from HISTORY \n" +
        "        where\n" +
        "        (\n" +
        "        TO_DATE((select to_char(SYSDATE, 'YYYY-MM-DD ') FROM DUAL), 'YYYY-MM-DD ')\n" +
        "        =\n" +
        "        to_date(\n" +
        "        to_char(\n" +
        "          to_date(HISTORY_time,'YYYY-MM-DD HH24:MI:SS'),'YYYY-MM-DD'\n" +
        "          ),\n" +
        "          'YYYY-MM-DD '\n" +
        "          )\n" +
        "        )\n" +
        "        AND\n" +
        "        user_id =(select id from jhi_user where login=:login) \n" +
        "   ", nativeQuery = true)
    Long totalHistoryByDateAndLogin(@Param("login") String login);

    @Query(value = "SELECT \n" +
        "        id,\n" +
        "        HISTORY_NAME,\n" +
        "        (  select trunc(sysdate) - to_date(to_char(to_date(ah.HISTORY_time,'YYYY-MM-DD HH24:MI:SS'), 'YYYY-MM-DD') ,'YYYY-MM-DD')from dual \n" +
        "        ) HISTORY_time,\n" +
        "        null COURSE_ID,\n" +
        "        null LESSON_ID,\n" +
        "        USER_ID\n" +
        "        from HISTORY ah\n" +
        "        where\n" +
        "        (\n" +
        "        to_date(\n" +
        "        to_char(\n" +
        "          to_date(ah.HISTORY_time,'YYYY-MM-DD HH24:MI:SS'),'YYYY-MM-DD'\n" +
        "          ),\n" +
        "          'YYYY-MM-DD '\n" +
        "          )\n" +
        "          BETWEEN \n" +
        "          ( select trunc(last_day(sysdate)-1, 'mm') from dual)\n" +
        "          AND\n" +
        "          ( SELECT LAST_DAY(SYSDATE) FROM dual)\n" +
        "        )\n" +
        "        AND\n" +
        "        user_id =(select id from jhi_user where login= :login)  ORDER BY HISTORY_TIME asc offset :start rows fetch next :limit rows only", nativeQuery = true)
    List<History> findAllByCurrentMonthAndUserLogin(@Param("login") String login, @Param("start") Long start, @Param("limit") Integer limit);

    @Query(value = "SELECT \n" +
        "    count(*)\n" +
        "        from HISTORY ah\n" +
        "        where\n" +
        "        (\n" +
        "        to_date(\n" +
        "        to_char(\n" +
        "          to_date(ah.HISTORY_time,'YYYY-MM-DD HH24:MI:SS'),'YYYY-MM-DD'\n" +
        "          ),\n" +
        "          'YYYY-MM-DD '\n" +
        "          ) \n" +
        "          BETWEEN \n" +
        "          ( select trunc(last_day(sysdate)-1, 'mm') from dual)\n" +
        "          AND\n" +
        "          ( SELECT LAST_DAY(SYSDATE) FROM dual)\n" +
        "        )\n" +
        "        AND\n" +
        "        user_id =(select id from jhi_user where login= :login)", nativeQuery = true)
    Long totalHistoryByCurrentMonthAndUserLogin(@Param("login") String login);

    @Query(value = "DELETE FROM HISTORY WHERE id in (:ids)",nativeQuery = true)
    void deleteAllByIds(@Param("ids") List<Long> ids);

}
