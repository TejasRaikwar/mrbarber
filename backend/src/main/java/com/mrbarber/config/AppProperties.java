package com.mrbarber.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Data
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private Jwt jwt = new Jwt();
    private Uploads uploads = new Uploads();
    private Cors cors = new Cors();
    private Seed seed = new Seed();

    @Data
    public static class Jwt {
        private String secret;
        private long expirationMs;
    }

    @Data
    public static class Uploads {
        private String dir;
        private String publicBaseUrl;
    }

    @Data
    public static class Cors {
        private List<String> allowedOrigins;
    }

    @Data
    public static class Seed {
        private String adminUsername;
        private String adminPassword;
    }
}
