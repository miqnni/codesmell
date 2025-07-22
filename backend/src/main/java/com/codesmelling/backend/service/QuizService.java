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

import java.io.FileNotFoundException;
import java.nio.charset.StandardCharsets;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.*;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final CsvParserService parser;
    private final CsvFileConfigLoader loader;

    public QuizContentDto getQuizContent(Long quizId) throws IOException {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        String quizFolder = "code/" + quiz.getQuizName();
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

        // Wczytaj wszystkie pliki z folderu quizu rekurencyjnie
        Resource[] files = resolver.getResources("classpath*:" + quizFolder + "/**/*");

        QuizContentDto dto = new QuizContentDto();
        List<QuizContentDto.CodeFileDto> codeFiles = new ArrayList<>();
        String errorTagsCsvContent = null;
        String solutionContent = null;


        File anyFile = files[0].getFile();
        File quizDir = anyFile.getParentFile();
        while (quizDir != null && !quizDir.getName().equals(quiz.getQuizName())) {
            quizDir = quizDir.getParentFile();
        }
        if (quizDir == null) {
            throw new IOException("Cannot locate quiz base directory");
        }
        Path basePath = quizDir.getCanonicalFile().toPath();

        for (Resource file : files) {
            File actualFile = file.getFile();
            if (!actualFile.isFile()) continue;

            Path filePath = actualFile.getCanonicalFile().toPath();
            String relativePath = basePath.relativize(filePath).toString().replace("\\", "/");

            String content = new String(file.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

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

        dto.setCodeFiles(codeFiles);
        dto.setErrorTagsCsvContent(errorTagsCsvContent);
        dto.setSolutionContent(solutionContent);

        return dto;
    }

    public List<QuizListDto> getQuizShortList() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource codeDir = resolver.getResource("classpath:code");

        File baseDir = codeDir.getFile();  // Działa tylko lokalnie
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
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource codeDir = resolver.getResource("classpath:code");

        File baseDir = codeDir.getFile();  // Działa tylko w dev (nie z JARa)
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
            dto.setCodeFilePaths(codeFilePaths);  // <-- dodaj to pole do QuizListDto

            result.add(dto);
        }

        System.out.println("Łącznie znaleziono quizów: " + result.size());
        return result;
    }

    public QuizFilesDto getQuizById(Long quizId) throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource codeDir = resolver.getResource("classpath:code");

        File baseDir = codeDir.getFile();  // Tylko w dev
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
                if (!fileName.equals("Solution.txt") && !fileName.equals("ErrorTags.csv")) {
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

        String basePath = "code/" + quiz.getQuizName(); // np. "code/quiz1"
        String fullPath = basePath + "/" + relativePath; // np. "code/quiz1/Client/client.py"

        // Wyszukaj plik w resources (uwzględnia podfoldery)
        Resource resource = new ClassPathResource(fullPath);

        if (!resource.exists()) {
            throw new FileNotFoundException("File not found: " + fullPath);
        }

        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }


    private Long extractQuizId(String folderName) {
        return quizRepository.findByQuizName(folderName)
                .map(Quiz::getId)
                .orElse(null);
    }

}
