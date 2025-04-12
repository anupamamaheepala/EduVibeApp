package com.eduvibe.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tests")
public record TestEntity(@Id String id, String name) {
    public TestEntity(String name) {
        this(null, name);
    }
}