package com.eduvibe.backend.controller;

import com.eduvibe.backend.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private TestService testService;

    @GetMapping("/test")
    public String testConnection() {
        return testService.testConnection();
    }

    @GetMapping("/test-db")
    public String testDbConnection() {
        return testService.testDbConnection();
    }
}