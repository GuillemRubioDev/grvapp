package com.grvapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.grvapp.backend")
public class BackendApplication {
    public static void main(String[] args) {

        SpringApplication app = new SpringApplication(BackendApplication.class);

        // Agregar el inicializador que carga el .env
        app.addInitializers(new DotenvInitializer());

        app.run(args);
    }

}
