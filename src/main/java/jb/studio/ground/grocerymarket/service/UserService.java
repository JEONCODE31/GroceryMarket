package jb.studio.ground.grocerymarket.service;

import jb.studio.ground.grocerymarket.domain.entity.User;
import jb.studio.ground.grocerymarket.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    /**
     * 모든 회원 목록을 조회합니다.
     *
     * @return 모든 회원 객체 목록
     */
    public List<User> getAllUsers() {
        return userMapper.findAllUsers();
    }
}