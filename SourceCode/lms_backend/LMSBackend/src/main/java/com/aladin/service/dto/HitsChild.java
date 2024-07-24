package com.aladin.service.dto;

public class HitsChild {
    private String _index;
    private String _type;
    private String _id;
    private Double _score;
    private SearchAllResponse _source;

    public HitsChild() {
        super();
        // TODO Auto-generated constructor stub
    }

    public HitsChild(String _index, String _type, String _id, Double _score, SearchAllResponse _source) {
        super();
        this._index = _index;
        this._type = _type;
        this._id = _id;
        this._score = _score;
        this._source = _source;
    }

    public String get_index() {
        return _index;
    }

    public void set_index(String _index) {
        this._index = _index;
    }

    public String get_type() {
        return _type;
    }

    public void set_type(String _type) {
        this._type = _type;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public Double get_score() {
        return _score;
    }

    public void set_score(Double _score) {
        this._score = _score;
    }

    public SearchAllResponse get_source() {
        return _source;
    }

    public void set_source(SearchAllResponse _source) {
        this._source = _source;
    }

    @Override
    public String toString() {
        return "HitsChild{" +
            "_index='" + _index + '\'' +
            ", _type='" + _type + '\'' +
            ", _id='" + _id + '\'' +
            ", _score=" + _score +
            ", _source=" + _source +
            '}';
    }
}
