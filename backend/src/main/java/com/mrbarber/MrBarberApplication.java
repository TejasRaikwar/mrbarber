package com.mrbarber;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class MrBarberApplication {
    public static void main(String[] args) {
        SpringApplication.run(MrBarberApplication.class, args);
    }
}
