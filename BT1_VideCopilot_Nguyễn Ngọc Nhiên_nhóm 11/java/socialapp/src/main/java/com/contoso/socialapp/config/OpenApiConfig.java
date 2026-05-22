package com.contoso.socialapp.config;

import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.yaml.snakeyaml.Yaml;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        try {
            // Try to load openapi.yaml from the parent directory (same level as python/)
            Path openApiPath = Paths.get("../openapi.yaml");
            if (!Files.exists(openApiPath)) {
                // Fallback to classpath
                openApiPath = Paths.get("openapi.yaml");
            }

            String yamlContent;
            if (Files.exists(openApiPath)) {
                yamlContent = Files.readString(openApiPath);
            } else {
                // Last resort - try classpath
                Resource resource = new ClassPathResource("openapi.yaml");
                try (InputStream inputStream = resource.getInputStream()) {
                    yamlContent = new String(inputStream.readAllBytes());
                }
            }

            Yaml yaml = new Yaml();
            Map<String, Object> yamlMap = yaml.load(yamlContent);

            OpenAPI openAPI = new OpenAPI();

            // Set info from YAML
            if (yamlMap.containsKey("info")) {
                Map<String, Object> info = (Map<String, Object>) yamlMap.get("info");
                io.swagger.v3.oas.models.info.Info apiInfo = new io.swagger.v3.oas.models.info.Info();
                apiInfo.setTitle((String) info.get("title"));
                apiInfo.setDescription((String) info.get("description"));
                apiInfo.setVersion((String) info.get("version"));
                openAPI.setInfo(apiInfo);
            }

            return openAPI;
        } catch (Exception e) {
            // Fallback to default OpenAPI
            return new OpenAPI()
                    .info(new io.swagger.v3.oas.models.info.Info()
                            .title("Simple Social Media API")
                            .description("API for posts, comments, and likes (MVP)")
                            .version("1.0.0"));
        }
    }
}
