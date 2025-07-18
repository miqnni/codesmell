package com.codesmelling.backend.config;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
public class CsvFileConfigLoader {
    public InputStream load(String filename) throws IOException {
        return getClass().getClassLoader().getResourceAsStream("csv/" + filename);
    }
}