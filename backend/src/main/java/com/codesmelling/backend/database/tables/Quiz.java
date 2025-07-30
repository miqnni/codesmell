package com.codesmelling.backend.database.tables;

import com.codesmelling.backend.config.LanguagesDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "quiz")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Np. "java/quiz1", czyli ścieżka względem np. /resources/quizzes
    @Column(name = "quizName")
    private String quizName;

    // Błędy przypisane do tego quizu
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<ErrorTag> errorTags;

    // Skala trudności 1–5
    @Column(name = "difficulty")
    private int difficulty;

    // Lista języków przypisanych do quizu (np. "Java", "Python")
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "quiz_languages", joinColumns = @JoinColumn(name = "quiz_id"))
    @JsonDeserialize(using = LanguagesDeserializer.class)
    @Column(name = "language")
    private Set<String> languages;

}
