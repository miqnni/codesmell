package com.codesmelling.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SequenceResetService {

    @PersistenceContext
    private EntityManager entityManager;

    public void resetAllSequences() {
        entityManager.createNativeQuery("ALTER SEQUENCE app_user_id_seq RESTART WITH 1").executeUpdate();
        entityManager.createNativeQuery("ALTER SEQUENCE quiz_id_seq RESTART WITH 1").executeUpdate();
        entityManager.createNativeQuery("ALTER SEQUENCE error_tag_id_seq RESTART WITH 1").executeUpdate();
        entityManager.createNativeQuery("ALTER SEQUENCE user_progress_id_seq RESTART WITH 1").executeUpdate();
    }
}