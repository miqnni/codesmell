package com.codesmelling.backend.database.tables;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
}
