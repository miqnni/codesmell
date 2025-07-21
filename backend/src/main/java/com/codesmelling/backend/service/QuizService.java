package com.codesmelling.backend.service;

import com.codesmelling.backend.config.CsvFileConfigLoader;
import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.database.tables.Quiz;
import com.codesmelling.backend.dto.Quiz.LanguageGroupDto;
import com.codesmelling.backend.dto.Quiz.QuizContentDto;
import com.codesmelling.backend.dto.Quiz.QuizListDto;
import com.codesmelling.backend.repository.AppUserRepository;
import com.codesmelling.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final CsvParserService parser;
    private final CsvFileConfigLoader loader;

    public QuizContentDto getQuizContent(Long quizId) throws IOException {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        String quizFolder = "code/" + quiz.getQuizName();  // ścieżka w resources

        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

        // Znajdź wszystkie pliki w folderze quizu (code/{quizName}/*)
        Resource[] files = resolver.getResources("classpath:" + quizFolder + "/*");

        QuizContentDto dto = new QuizContentDto();
        List<QuizContentDto.CodeFileDto> codeFiles = new ArrayList<>();
        String errorTagsCsvContent = null;
        String solutionContent = null;

        for (Resource file : files) {
            String filename = file.getFilename();
            if (filename == null) continue;

            String content = new String(file.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            if (filename.equalsIgnoreCase("ErrorTags.csv")) {
                errorTagsCsvContent = content;
            } else if (filename.equalsIgnoreCase("Solution.txt")) {
                solutionContent = content;
            } else {
                // Inne pliki traktujemy jako pliki z kodem
                QuizContentDto.CodeFileDto codeFileDto = new QuizContentDto.CodeFileDto();
                codeFileDto.setFileName(filename);
                codeFileDto.setContent(content);
                codeFiles.add(codeFileDto);
            }
        }

        dto.setCodeFiles(codeFiles);
        dto.setErrorTagsCsvContent(errorTagsCsvContent);
        dto.setSolutionContent(solutionContent);

        return dto;
    }

    public void importQuizzes() throws IOException {
        InputStream in = loader.load("Quizzes.csv");
        List<Quiz> quizzes = parser.parse(Quiz.class, in);
        quizRepository.saveAll(quizzes);
    }

    public List<QuizListDto> getAvailableQuizzes() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

        Resource codeDir = resolver.getResource("classpath:code");

        File baseDir = codeDir.getFile();  // Działa tylko w trybie dev / nie z JARa
        System.out.println("Ścieżka bazowa: " + baseDir.getAbsolutePath());

        List<QuizListDto> result = new ArrayList<>();

        File[] quizFolders = baseDir.listFiles(File::isDirectory);
        if (quizFolders == null) {
            System.out.println("Brak folderów z quizami.");
            return result;
        }

        for (File quizDir : quizFolders) {
            String folderName = quizDir.getName();
            Long quizId = extractQuizId(folderName);

            System.out.println("Znaleziono folder quizu: " + folderName + " (ID: " + quizId + ")");

            QuizListDto dto = new QuizListDto();
            dto.setQuizName(folderName);
            dto.setQuizId(quizId);

            result.add(dto);
        }

        System.out.println("Łącznie znaleziono quizów: " + result.size());
        return result;
    }


    private Long extractQuizId(String folderName) {
        return quizRepository.findByQuizName(folderName)
                .map(Quiz::getId)
                .orElse(null);
    }

}
