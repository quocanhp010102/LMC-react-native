package com.aladin.service.dto;

import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

public class Hits {
    private Total total;

    @Field(type = FieldType.Float, name = "max_score")
    private Float max_score;

    private List<HitsChild> hits;

    public Hits() {
    }

    public Hits(Total total, Float max_score, List<HitsChild> hits) {
        this.total = total;
        this.max_score = max_score;
        this.hits = hits;
    }

    public Total getTotal() {
        return total;
    }

    public void setTotal(Total total) {
        this.total = total;
    }

    public Float getMax_score() {
        return max_score;
    }

    public void setMax_score(Float max_score) {
        this.max_score = max_score;
    }

    public List<HitsChild> getHits() {
        return hits;
    }

    public void setHits(List<HitsChild> hits) {
        this.hits = hits;
    }

    @Override
    public String toString() {
        return "Hits{" +
            "total=" + total +
            ", max_score='" + max_score + '\'' +
            ", hits=" + hits +
            '}';
    }
}
