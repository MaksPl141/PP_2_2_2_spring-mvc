package com.example.demo.Repository;

import java.util.List;

public interface UserRepository {

        List<com.example.demo.model.User> getAllUsers();

        void createUser(com.example.demo.model.User user);

        void updateUser(com.example.demo.model.User user);

        com.example.demo.model.User readUser(Long id);

        void deleteUser(Long id);
}