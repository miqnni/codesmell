package com.codesmelling.backend.service;

import com.codesmelling.backend.config.CsvFileConfigLoader;
import com.codesmelling.backend.database.tables.Quiz;
import com.codesmelling.backend.dto.Quiz.QuizContentDto;
import com.codesmelling.backend.dto.Quiz.QuizDto;
import com.codesmelling.backend.dto.Quiz.QuizFilesDto;
import com.codesmelling.backend.dto.Quiz.QuizListDto;
import com.codesmelling.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
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

        File quizDir = new File("app/quizzes", quiz.getQuizName());
        if (!quizDir.exists() || !quizDir.isDirectory()) {
            throw new IOException("Quiz directory not found: " + quizDir.getAbsolutePath());
        }

        Path basePath = quizDir.getCanonicalFile().toPath();

        QuizContentDto dto = new QuizContentDto();
        List<QuizContentDto.CodeFileDto> codeFiles = new ArrayList<>();
        String errorTagsCsvContent = null;
        String solutionContent = null;

        // Przejdź po plikach rekurencyjnie
        try (Stream<Path> stream = Files.walk(basePath)) {
            for (Path path : stream.toList()) {
                if (!Files.isRegularFile(path)) continue;

                Path filePath = path.toAbsolutePath();
                String relativePath = basePath.relativize(filePath).toString().replace("\\", "/");
                String content = Files.readString(path, StandardCharsets.UTF_8);

                if (relativePath.equalsIgnoreCase("ErrorTags.csv")) {
                    errorTagsCsvContent = content;
                } else if (relativePath.equalsIgnoreCase("Solution.txt")) {
                    solutionContent = content;
                } else {
                    QuizContentDto.CodeFileDto codeFileDto = new QuizContentDto.CodeFileDto();
                    codeFileDto.setFileName(relativePath);
                    codeFileDto.setContent(content);
                    codeFiles.add(codeFileDto);
                }
            }
        }

        dto.setCodeFiles(codeFiles);
        dto.setErrorTagsCsvContent(errorTagsCsvContent);
        dto.setSolutionContent(solutionContent);

        return dto;
    }

    public List<QuizListDto> getQuizShortList() throws IOException {
//        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
//        Resource codeDir = resolver.getResource("classpath:code");
//
//        File baseDir = codeDir.getFile();  // Działa tylko lokalnie
//        File[] quizFolders = baseDir.listFiles(File::isDirectory);
        File baseDir = new File("app/quizzes"); // <- folder na tym samym poziomie co JAR (czyli /app/quizzes)
        File[] quizFolders = baseDir.listFiles(File::isDirectory);

        List<QuizListDto> result = new ArrayList<>();
        if (quizFolders == null) return result;

        for (File quizDir : quizFolders) {
            String folderName = quizDir.getName();
            Long quizId = extractQuizId(folderName);
            if (quizId != null) {
                result.add(new QuizListDto(quizId, folderName));
            }
        }

        return result;
    }

    public void importQuizzes() throws IOException {
        InputStream in = loader.load("Quizzes.csv");
        List<Quiz> quizzes = parser.parse(Quiz.class, in);
        quizRepository.saveAll(quizzes);
    }

    public List<QuizFilesDto> getAvailableQuizzes() throws IOException {
        File baseDir = new File("app/quizzes"); // <-- zakłada folder obok JARa (czyli /app/quizzes)
        System.out.println("Ścieżka bazowa: " + baseDir.getAbsolutePath());

        List<QuizFilesDto> result = new ArrayList<>();
        File[] quizFolders = baseDir.listFiles(File::isDirectory);

        if (quizFolders == null) {
            System.out.println("Brak folderów z quizami.");
            return result;
        }

        for (File quizDir : quizFolders) {
            String folderName = quizDir.getName();
            Long quizId = extractQuizId(folderName);

            System.out.println("Znaleziono folder quizu: " + folderName + " (ID: " + quizId + ")");

            // Rekurencyjnie zbierz ścieżki do plików kodu
            List<String> codeFilePaths = new ArrayList<>();
            collectCodeFiles(quizDir, quizDir, codeFilePaths);

            QuizFilesDto dto = new QuizFilesDto();
            dto.setQuizName(folderName);
            dto.setQuizId(quizId);
            dto.setCodeFilePaths(codeFilePaths);

            result.add(dto);
        }

        System.out.println("Łącznie znaleziono quizów: " + result.size());
        return result;
    }

    public QuizFilesDto getQuizById(Long quizId) throws IOException {
        File baseDir = new File("app/quizzes");  // <- katalog z quizami (na tym samym poziomie co JAR)
        File[] quizFolders = baseDir.listFiles(File::isDirectory);

        if (quizFolders == null) {
            throw new FileNotFoundException("Brak folderów z quizami");
        }

        for (File quizDir : quizFolders) {
            Long foundId = extractQuizId(quizDir.getName());
            if (Objects.equals(foundId, quizId)) {
                List<String> codeFilePaths = new ArrayList<>();
                collectCodeFiles(quizDir, quizDir, codeFilePaths);

                QuizFilesDto dto = new QuizFilesDto();
                dto.setQuizId(quizId);
                dto.setQuizName(quizDir.getName());
                dto.setCodeFilePaths(codeFilePaths);  // upewnij się, że masz takie pole w DTO
                return dto;
            }
        }

        throw new FileNotFoundException("Nie znaleziono quizu o ID: " + quizId);
    }

    private void collectCodeFiles(File baseDir, File currentDir, List<String> result) {
        File[] files = currentDir.listFiles();
        if (files == null) return;

        for (File file : files) {
            if (file.isDirectory()) {
                collectCodeFiles(baseDir, file, result);
            } else {
                String fileName = file.getName();
                if (!fileName.equals("Solution.txt") && !fileName.equals("ErrorTags.csv") && !fileName.equals("Tags.csv")) {
                    // Ścieżka względna względem folderu quizu
                    Path relativePath = baseDir.toPath().relativize(file.toPath());
                    result.add(relativePath.toString().replace(File.separatorChar, '/'));
                }
            }
        }
    }

    public String getFileContentInQuiz(Long quizId, String relativePath) throws IOException {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Ścieżka do katalogu quizu, np. "quizzes/quiz_5"
        File baseDir = new File("app/quizzes", quiz.getQuizName());

        // Konkretna ścieżka do pliku wewnątrz katalogu quizu
        File targetFile = new File(baseDir, relativePath);

        if (!targetFile.exists() || !targetFile.isFile()) {
            throw new FileNotFoundException("File not found: " + targetFile.getAbsolutePath());
        }

        return Files.readString(targetFile.toPath(), StandardCharsets.UTF_8);
    }


    private Long extractQuizId(String folderName) {
        return quizRepository.findByQuizName(folderName)
                .map(Quiz::getId)
                .orElse(null);
    }

}
