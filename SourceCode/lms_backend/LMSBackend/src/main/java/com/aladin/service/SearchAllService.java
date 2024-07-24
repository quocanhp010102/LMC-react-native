package com.aladin.service;


import com.aladin.domain.Course;
import com.aladin.domain.Student;
import com.aladin.search.helper.Indices;
import com.aladin.service.dto.HitsChild;
import com.aladin.service.dto.NewsDTO;
import com.aladin.service.dto.ResponseData;
import com.aladin.service.dto.SearchAllResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchAllService {
    //    @Value("${spring.elasticsearch.rest.uris}")
    private String prefix = "http://192.168.1.158:9200";
    //    @Value("${spring.elasticsearch.rest.suffix}")
    private String suffix = "_search?q=";

    private String courseSearchFields = new Course().searchField();
    private String courseResponseFields = new Course().ResponseField();

    private String studentSearchFields = new Student().getSearchField();
    private String studentResponseFields = new Student().getResponseField();

    private String newsSearchFields = new NewsDTO().getSearchField();
    private String newsResponseFields = new NewsDTO().getResponseField();

    private String format(String text) {
        return "\"" + text + "\"";
    }

    private String handleArray(String[] array) {
        String result = "";
        for (int i = 0; i < array.length; i++) {
            result += format(array[i]) + ",";
        }
        return result.substring(0, result.length() - 1);
    }

    public Page<SearchAllResponse> searchAll(String[] searchFields, String[] responseFields, String indexes, String query, Pageable pageable) {
        if (query.length() > 0) {
            query = query.replace(' ', '+');
            CloseableHttpClient httpClient = HttpClients.createDefault();
            String searchFieldsString = format("query") + ":{" + format("multi_match") + ":{" + format("query") + ":" + format(query) + "," + format("type") + ":" + format("phrase_prefix") + "," + format("fields") + ":[" + handleArray(searchFields) + "]}},";
            String responseFieldsString = "\"_source\":[" + handleArray(responseFields) + "],";
            int offset = pageable.getPageSize() * pageable.getPageNumber();
            String body = "{" + searchFieldsString + responseFieldsString + format("from") + ":" + offset + "," + format("size") + ":" + pageable.getPageSize() + "}";
            String url = prefix + "/" + indexes + "/" + suffix;
            HttpPost httpPost = new HttpPost(url + query);
            HttpEntity stringEntity = new StringEntity(body, ContentType.APPLICATION_JSON);
            httpPost.setEntity(stringEntity);
            try {
                HttpResponse response = httpClient.execute(httpPost);
                HttpEntity entity = response.getEntity();
                String json = EntityUtils.toString(entity, StandardCharsets.UTF_8);
                JSONObject o = new JSONObject(json);
                Gson gson = new GsonBuilder().create();
                ResponseData responseData = gson.fromJson(o.toString(), ResponseData.class);
                List<HitsChild> listHits = responseData.getHits().getHits();
                List<SearchAllResponse> searchAllResponseList = new ArrayList<>();
                for (HitsChild hitChild : listHits) {
                    SearchAllResponse searchAllResponse = hitChild.get_source();
                    searchAllResponse.setIndex(hitChild.get_index());
                    if (hitChild.get_index().equals(Indices.NEWS_INDEX)) {
                        searchAllResponse.setIndex("news");
                        searchAllResponse.setDisplayInfo(hitChild.get_source().getNews_title());
                    }
                    searchAllResponseList.add(searchAllResponse);
                }
                return new PageImpl<>(searchAllResponseList, pageable, responseData.getHits().getTotal().getValue());
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            return null;
        }
        return null;
    }

    public Page<SearchAllResponse> searchAllPublic(String query, Pageable pageable) {
        String searchFieldsString = newsSearchFields;
        String searchFields[] = searchFieldsString.split(",");
        String responseFieldsString = newsResponseFields + ",id";
        String responseFields[] = responseFieldsString.split(",");
        String indexes = Indices.NEWS_INDEX;
        return searchAll(searchFields, responseFields, indexes, query, pageable);
    }

//    public Page<SearchAllResponse> searchAllByRole(String query, Pageable pageable) {
//        String searchFieldsString = serviceSearchFields + "," + recruitmentSearchFields + "," + employeeSearchFields;
//        String searchFields[] = searchFieldsString.split("\\,");
//        String responseFieldsString = serviceResponseFields + "," + recruitmentResponseFields + "," + employeeResponseFields + ",id";
//        String responseFields[] = responseFieldsString.split("\\,");
//        String indexes = "employee,recruitment,services";
//        return searchAll(searchFields, responseFields, indexes, query, pageable);
//    }

}

