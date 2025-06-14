package com.grvapp.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertiesPropertySource;

import java.util.Properties;

public class DotenvInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    @Override
    public void initialize(ConfigurableApplicationContext context) {
        Dotenv dotenv = Dotenv.configure()
                .directory(".") // raíz relativa al runtime (ojo si ejecutas como JAR o en Docker)
                .filename(".env")
                .ignoreIfMissing() // <--- evita que crashee si no se encuentra el archivo
                .load();

        Properties props = new Properties();
        dotenv.entries().forEach(entry -> props.put(entry.getKey(), entry.getValue()));

        MutablePropertySources sources = context.getEnvironment().getPropertySources();
        sources.addFirst(new PropertiesPropertySource("dotenvProperties", props));
    }
}