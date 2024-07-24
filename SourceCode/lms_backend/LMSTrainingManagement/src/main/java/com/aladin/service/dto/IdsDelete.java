package com.aladin.service.dto;


import java.util.List;

public class IdsDelete {
    private List<Long> ids;

    public IdsDelete(List<Long> ids) {
        this.ids = ids;
    }

    public IdsDelete() {
    }

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }
}
