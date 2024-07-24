package com.aladin.service.dto;

import com.aladin.search.helper.Indices;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Id;

@Document(indexName = Indices.TYPE_OF_EXAMS_INDEX)
public class TypeOfExamsDTO {
    private static final long serialVersionUID = 1L;

    @Id
    @Field(type = FieldType.Keyword)
    private Long id;

    @Field(type = FieldType.Text, name = "type_of_exams_name")
    private String typeOfExamsName;


    public Long getId() {
        return this.id;
    }

    public TypeOfExamsDTO id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeOfExamsName() {
        return this.typeOfExamsName;
    }

    public TypeOfExamsDTO typeOfExamsName(String typeOfExamsName) {
        this.setTypeOfExamsName(typeOfExamsName);
        return this;
    }

    public void setTypeOfExamsName(String typeOfExamsName) {
        this.typeOfExamsName = typeOfExamsName;
    }

}
