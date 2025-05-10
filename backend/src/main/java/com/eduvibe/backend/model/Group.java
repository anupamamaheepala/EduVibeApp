package com.eduvibe.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "groups")
public class Group {
    @Id
    private String id;
    private String name;
    private String creatorId;
    private List<String> memberIds;

    public Group() {
        this.memberIds = new ArrayList<>();
    }

    public Group(String name, String creatorId) {
        this.name = name;
        this.creatorId = creatorId;
        this.memberIds = new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCreatorId() { return creatorId; }
    public void setCreatorId(String creatorId) { this.creatorId = creatorId; }

    public List<String> getMemberIds() { return memberIds; }
    public void setMemberIds(List<String> memberIds) { this.memberIds = memberIds; }
}