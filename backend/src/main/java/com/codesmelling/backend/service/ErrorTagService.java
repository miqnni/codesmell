package com.codesmelling.backend.service;

import com.codesmelling.backend.database.enums.ErrorType;
import com.codesmelling.backend.database.tables.ErrorTag;
import com.codesmelling.backend.database.tables.Quiz;
import com.codesmelling.backend.dto.ErrorTag.ErrorTagCsvDto;
import com.codesmelling.backend.repository.ErrorTagRepository;
import com.codesmelling.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ErrorTagService {

    private final CsvParserService parser;
    private final QuizRepository quizRepository;
    private final ErrorTagRepository errorTagRepository;

    public void importAllErrorTags() {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

        try {
            // Szukaj wszystkich plików ErrorTags.csv w dowolnym folderze resources/code/**/
            Resource[] resources = resolver.getResources("classpath:code/**/ErrorTags.csv");

            for (Resource resource : resources) {
                try (InputStream is = resource.getInputStream()) {
                    List<ErrorTagCsvDto> dtos = parser.parse(ErrorTagCsvDto.class, is);

                    List<ErrorTag> tags = dtos.stream().map(dto -> {
                        Quiz quiz = quizRepository.findById(dto.getQuizId()).orElseThrow(() ->
                                new RuntimeException("Quiz not found: ID = " + dto.getQuizId()));
                        return ErrorTag.builder()
                                .lineNumber(dto.getLineNumber())
                                .fileName(dto.getFileName())
                                .type(ErrorType.valueOf(dto.getType().toString())) //.type(ErrorType.valueOf(dto.getType().toUpperCase()))
                                .quiz(quiz)
                                .build();
                    }).toList();

                    errorTagRepository.saveAll(tags);
                    System.out.println("✔ Imported from: " + resource.getFilename());
                } catch (Exception e) {
                    System.err.println("⚠ Failed to import from: " + resource.getFilename());
                    e.printStackTrace();
                }
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to search ErrorTags.csv files.");
            e.printStackTrace();
        }
    }
}
