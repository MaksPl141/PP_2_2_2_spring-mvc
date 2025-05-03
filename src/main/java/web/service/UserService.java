package web.service;

import web.model.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User readUser(long id);

    User deleteUser(long id);

    void createOrUpdateUser(User user);

    void addUser(User user);

    void updateUser(User user);

    User getUserById(Long id);

    void saveOrUpdateUser(User user);
}