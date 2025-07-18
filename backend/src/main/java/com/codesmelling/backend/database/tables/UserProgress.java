package com.codesmelling.backend.database.tables;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_progress")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int correctAnswers;

    private int totalAnswers;

    private double scorePercent;

    private boolean completed;

//    @Column(name = "user_id")
//    private Long userId;
//
//    @Column(name = "quiz_id")
//    private Long quizId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;
}
