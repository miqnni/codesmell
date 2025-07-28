package com.codesmelling.backend.service;

import com.codesmelling.backend.database.tables.ErrorTag;
import com.codesmelling.backend.database.tables.Quiz;
import com.codesmelling.backend.dto.ErrorTag.ErrorTagCsvDto;
import com.codesmelling.backend.repository.ErrorTagRepository;
import com.codesmelling.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ErrorTagService {

    private final CsvParserService parser;
    private final QuizRepository quizRepository;
    private final ErrorTagRepository errorTagRepository;

    public void importAllErrorTags() {
        File quizzesDir = new File("quizzes");

        if (!quizzesDir.exists() || !quizzesDir.isDirectory()) {
            System.err.println("❌ Folder 'quizzes/' nie istnieje lub nie jest katalogiem.");
            return;
        }

        // Przeszukaj wszystkie podfoldery w 'quizzes/'
        File[] quizFolders = quizzesDir.listFiles(File::isDirectory);
        if (quizFolders == null) return;

        for (File quizFolder : quizFolders) {
            File errorTagsFile = new File(quizFolder, "ErrorTags.csv");

            if (!errorTagsFile.exists()) {
                System.out.println("⚠ Brak ErrorTags.csv w: " + quizFolder.getName());
                continue;
            }

            try (InputStream is = new FileInputStream(errorTagsFile)) {
                List<ErrorTagCsvDto> dtos = parser.parse(ErrorTagCsvDto.class, is);

                List<ErrorTag> tags = dtos.stream().map(dto -> {
                    Quiz quiz = quizRepository.findById(dto.getQuizId()).orElseThrow(() ->
                            new RuntimeException("Quiz not found: ID = " + dto.getQuizId()));
                    return ErrorTag.builder()
                            .lineNumber(dto.getLineNumber())
                            .fileName(dto.getFileName())
                            .type(dto.getType().trim())
                            .quiz(quiz)
                            .build();
                }).toList();

                errorTagRepository.saveAll(tags);
                System.out.println("✔ Zaimportowano z: " + errorTagsFile.getPath());
            } catch (Exception e) {
                System.err.println("⚠ Błąd podczas importu z: " + errorTagsFile.getPath());
                e.printStackTrace();
            }
        }
    }
}
