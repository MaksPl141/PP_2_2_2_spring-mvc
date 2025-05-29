package ru.kata.spring.boot_security.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
@Repository
public interface UserRepository {
        User findByEmail(String email);

        List<User> getAllUsers();

        void createUser(User user);

        void updateUser(User user);

        User readUser(Long id);

        void deleteUser(Long id);

        User findByUsername(String username);
}