package com.codesmelling.backend.service;

import com.codesmelling.backend.dto.Tag.TagDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizTagReaderService {

    private final Path quizzesBasePath = Paths.get("app/quizzes");

    public List<TagDto> readTagsForQuiz(Long quizId) {
        Path tagFilePath = quizzesBasePath.resolve("quiz" + quizId).resolve("Tags.csv");

        if (!Files.exists(tagFilePath)) {
            throw new RuntimeException("Tags.csv not found for quiz ID: " + quizId);
        }

        List<TagDto> tags = new ArrayList<>();

        try (BufferedReader reader = Files.newBufferedReader(tagFilePath)) {
            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue; // skip header
                }

                String[] parts = line.split(";");
                if (parts.length != 3) continue;

                tags.add(new TagDto(parts[0].trim(), parts[1].trim(), parts[2].trim()));
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read Tags.csv for quiz " + quizId, e);
        }

        return tags;
    }
}

