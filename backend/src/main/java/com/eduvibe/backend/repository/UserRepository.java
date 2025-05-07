// package com.eduvibe.backend.repository;

// import com.eduvibe.backend.model.User;
// import org.springframework.data.mongodb.repository.MongoRepository;
// import java.util.Optional;

// public interface UserRepository extends MongoRepository<User, String> {
//     Optional<User> findByUsername(String username);
//     Optional<User> findByEmail(String email);
//     Optional<User> findByUsernameOrEmail(String username, String email);
// }

package com.eduvibe.backend.repository;

import com.eduvibe.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    @Query("{'username': {$regex: ?0, $options: 'i'}}")
    List<User> findByUsernameContainingIgnoreCase(String username);
}