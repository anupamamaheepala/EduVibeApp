package com.eduvibe.backend.service;

import com.eduvibe.backend.model.TestEntity;
import com.eduvibe.backend.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestService {

    @Autowired
    private TestRepository testRepository  ;

    public String testConnection() {
        return "Backend is connected!";
    }

    public String testDbConnection() {
        testRepository.save(new TestEntity("Test"));
        return "MongoDB connection is working!";
    }
}