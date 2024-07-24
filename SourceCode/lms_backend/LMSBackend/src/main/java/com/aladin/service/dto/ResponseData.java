package com.aladin.service.dto;//package com.aladin.service.dto;

public class ResponseData {

    private Integer took;
    private Boolean timed_out;
    private Shards _shards;
    private Hits hits;

    public ResponseData() {
        super();
        // TODO Auto-generated constructor stub
    }

    public ResponseData(Integer took, Boolean timed_out, Shards _shards, Hits hits) {
        super();
        this.took = took;
        this.timed_out = timed_out;
        this._shards = _shards;
        this.hits = hits;
    }

    public Integer getTook() {
        return took;
    }

    public void setTook(Integer took) {
        this.took = took;
    }

    public Boolean getTimed_out() {
        return timed_out;
    }

    public void setTimed_out(Boolean timed_out) {
        this.timed_out = timed_out;
    }

    public Shards get_shards() {
        return _shards;
    }

    public void set_shards(Shards _shards) {
        this._shards = _shards;
    }

    public Hits getHits() {
        return hits;
    }

    public void setHits(Hits hits) {
        this.hits = hits;
    }

    @Override
    public String toString() {
        return "ResponseData{" +
            "took=" + took +
            ", timed_out=" + timed_out +
            ", _shards=" + _shards +
            ", hits=" + hits +
            '}';
    }
}
