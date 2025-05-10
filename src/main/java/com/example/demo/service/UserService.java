package com.example.demo.service;


import com.example.demo.model.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    void deleteUser(long id);

    void saveOrUpdateUser(User user);

    void createOrUpdateUser(User user);

    User getUserById(Long id);
}