package com.aladin.service.dto;//package com.aladin.service.dto;

public class Shards {
    private Integer total;
    private Integer successful;
    private Integer skipped;
    private Integer failed;

    public Shards(Integer total, Integer successful, Integer skipped, Integer failed) {
        super();
        this.total = total;
        this.successful = successful;
        this.skipped = skipped;
        this.failed = failed;
    }

    public Shards() {
        super();
        // TODO Auto-generated constructor stub
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getSuccessful() {
        return successful;
    }

    public void setSuccessful(Integer successful) {
        this.successful = successful;
    }

    public Integer getSkipped() {
        return skipped;
    }

    public void setSkipped(Integer skipped) {
        this.skipped = skipped;
    }

    public Integer getFailed() {
        return failed;
    }

    public void setFailed(Integer failed) {
        this.failed = failed;
    }

    @Override
    public String toString() {
        return "Shards{" +
            "total=" + total +
            ", successful=" + successful +
            ", skipped=" + skipped +
            ", failed=" + failed +
            '}';
    }
}
