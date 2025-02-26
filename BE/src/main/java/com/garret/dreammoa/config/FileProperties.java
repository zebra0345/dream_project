package com.garret.dreammoa.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "file")
public class FileProperties {

    private String uploadDir; // 파일 업로드 경로
    private String staticLocations; // 정적 리소스 경로

    // Getter와 Setter
    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public String getStaticLocations() {
        return staticLocations;
    }

    public void setStaticLocations(String staticLocations) {
        this.staticLocations = staticLocations;
    }
}