package com.codesmelling.backend.service;

import com.codesmelling.backend.database.tables.GlobalTag;
import com.codesmelling.backend.repository.GlobalTagRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

@Service
@RequiredArgsConstructor
public class GlobalTagLoaderService {

    private final GlobalTagRepository globalTagRepository;

    @PostConstruct
    public void loadGlobalTags() {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("csv/GlobalTags.csv")) {
            if (is == null) {
                System.out.println("GlobalTags.csv not found in resources.");
                return;
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
                String line;
                boolean firstLine = true;

                while ((line = reader.readLine()) != null) {
                    if (firstLine) {
                        firstLine = false;
                        continue;
                    }

                    String[] parts = line.split(";");
                    if (parts.length != 3) continue;

                    String code = parts[0].trim();
                    String desc = parts[1].trim();
                    String color = parts[2].trim();

                    if (globalTagRepository.findByCode(code).isEmpty()) {
                        globalTagRepository.save(new GlobalTag(null, code, desc, color));
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Error reading GlobalTags.csv", e);
        }
    }
}
