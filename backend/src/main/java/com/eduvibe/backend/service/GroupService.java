package com.eduvibe.backend.service;

import com.eduvibe.backend.model.Group;
import com.eduvibe.backend.model.Message;
import com.eduvibe.backend.model.User;
import com.eduvibe.backend.repository.GroupRepository;
import com.eduvibe.backend.repository.MessageRepository;
import com.eduvibe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    public Group createGroup(String userId, String groupName) throws Exception {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Group group = new Group(groupName, userId);
        group.getMemberIds().add(userId); // Creator is the only initial member

        Group savedGroup = groupRepository.save(group);

        // Add group to creator's groups list
        creator.getGroups().add(savedGroup.getId());
        userRepository.save(creator);

        return savedGroup;
    }

    public void addMember(String userId, String groupId, String memberId) throws Exception {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new Exception("Group not found"));
        if (!group.getCreatorId().equals(userId)) {
            throw new Exception("Only the creator can add members");
        }
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        if (!creator.getFollowing().contains(memberId)) {
            throw new Exception("Can only add users you are following");
        }
        if (!userRepository.existsById(memberId)) {
            throw new Exception("Member not found");
        }
        if (group.getMemberIds().contains(memberId)) {
            throw new Exception("User is already a member");
        }

        group.getMemberIds().add(memberId);
        groupRepository.save(group);

        User member = userRepository.findById(memberId).orElseThrow();
        member.getGroups().add(groupId);
        userRepository.save(member);
    }

    public void removeMember(String userId, String groupId, String memberId) throws Exception {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new Exception("Group not found"));
        if (!group.getCreatorId().equals(userId)) {
            throw new Exception("Only the creator can remove members");
        }
        if (!group.getMemberIds().contains(memberId)) {
            throw new Exception("User is not a member");
        }
        if (memberId.equals(userId)) {
            throw new Exception("Creator cannot remove themselves");
        }

        group.getMemberIds().remove(memberId);
        groupRepository.save(group);

        User member = userRepository.findById(memberId).orElseThrow();
        member.getGroups().remove(groupId);
        userRepository.save(member);
    }

    public void deleteGroup(String userId, String groupId) throws Exception {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new Exception("Group not found"));
        if (!group.getCreatorId().equals(userId)) {
            throw new Exception("Only the creator can delete the group");
        }

        // Remove group from all members' groups list
        List<User> members = userRepository.findAllById(group.getMemberIds());
        for (User member : members) {
            member.getGroups().remove(groupId);
            userRepository.save(member);
        }

        // Delete all messages associated with the group
        List<Message> messages = messageRepository.findByGroupIdOrderByTimestampAsc(groupId);
        messageRepository.deleteAll(messages);

        // Delete the group
        groupRepository.delete(group);
    }

    public List<Group> getUserGroups(String userId) {
        return groupRepository.findByMemberIdsContaining(userId);
    }

    public List<User> getGroupMembers(String groupId) throws Exception {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new Exception("Group not found"));
        return userRepository.findAllById(group.getMemberIds());
    }

    public Message sendMessage(String userId, String groupId, String content) throws Exception {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new Exception("Group not found"));
        if (!group.getMemberIds().contains(userId)) {
            throw new Exception("User is not a member of the group");
        }
        Message message = new Message(groupId, userId, content);
        return messageRepository.save(message);
    }

    public Message editMessage(String userId, String messageId, String newContent) throws Exception {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new Exception("Message not found"));
        if (!message.getUserId().equals(userId)) {
            throw new Exception("Only the message author can edit it");
        }
        message.setContent(newContent);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public void deleteMessage(String userId, String messageId) throws Exception {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new Exception("Message not found"));
        if (!message.getUserId().equals(userId)) {
            throw new Exception("Only the message author can delete it");
        }
        messageRepository.delete(message);
    }

    public List<Message> getGroupMessages(String groupId) throws Exception {
        groupRepository.findById(groupId)
                .orElseThrow(() -> new Exception("Group not found"));
        return messageRepository.findByGroupIdOrderByTimestampAsc(groupId);
    }
}