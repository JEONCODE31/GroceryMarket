package jb.studio.ground.grocerymarket.service;


import jb.studio.ground.grocerymarket.domain.entity.User;
import jb.studio.ground.grocerymarket.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserLoginService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserLoginService(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean userLogin(String email, String password) {
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            System.err.println("UserLogin: email or password is null/empty");
            return false;
        }

        try {
            User user = userMapper.selectUserByEmail(email);
            if (user == null) {
                System.err.println("UserLogin: user not found");
                return false;
            }

            if (!passwordEncoder.matches(password, user.getPassword())) {
                System.err.println("UserLogin: password does not match");
                return false;
            }

            System.out.println("UserLogin: user logged in");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean userLogOut() {
        System.out.println("UserLogOut: user logged out");
        return true;
    }
}

