package com.codesmelling.backend.controller;

import com.codesmelling.backend.dto.Tag.TagDto;
import com.codesmelling.backend.repository.GlobalTagRepository;
import com.codesmelling.backend.service.QuizTagReaderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
public class TagController {

    private final GlobalTagRepository globalTagRepository;
    private final QuizTagReaderService quizTagReaderService;

    @GetMapping("/global")
    public List<TagDto> getGlobalTags() {
        return globalTagRepository.findAll().stream()
                .map(tag -> new TagDto(tag.getCode(), tag.getDescription(), tag.getColorHex()))
                .toList();
    }

    @GetMapping("/quiz/{quizId}")
    public List<TagDto> getTagsForQuiz(@PathVariable Long quizId) {
        return quizTagReaderService.readTagsForQuiz(quizId);
    }
}