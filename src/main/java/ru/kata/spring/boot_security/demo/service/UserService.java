package ru.kata.spring.boot_security.demo.service;

import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.model.User;
import java.util.List;

@Service
public interface UserService {

    List<User> getAllUsers();

    void deleteUser(long id);

    void createOrUpdateUser(User user);

    User getUserById(Long id);

    void saveOrUpdateUser(User user);

    User findByUsername(String username);
}