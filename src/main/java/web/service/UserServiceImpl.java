package web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.Repository.UserRepository;
import web.model.User;

import javax.transaction.Transactional;
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
    public User readUser(long id) {
        return userRepository.readUser(id);
    }

    @Override
    public User deleteUser(long id) {
        return userRepository.deleteUser(id);
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
    public void addUser(User user) {
        userRepository.createUser(user);
    }

    @Override
    public void updateUser(User user) {
        userRepository.updateUser(user);
    }
}