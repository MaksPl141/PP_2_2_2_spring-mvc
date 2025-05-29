package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.Repository.UserRepository;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

    @Override
    public void deleteUser(long id) {
        userRepository.deleteUser(id);
    }

    @Override
    public void createOrUpdateUser(User user) {
        if (user.getId() == null || userRepository.readUser(user.getId()) == null) {
            userRepository.createUser(user);
        } else {
            userRepository.updateUser(user);
        }
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.readUser(id);
    }

    @Override
    public void saveOrUpdateUser(User user) {
        createOrUpdateUser(user);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}