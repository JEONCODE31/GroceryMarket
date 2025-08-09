package jb.studio.ground.grocerymarket.service;

import jb.studio.ground.grocerymarket.domain.entity.User;
import jb.studio.ground.grocerymarket.domain.entity.Role; // Role enum 임포트
import jb.studio.ground.grocerymarket.mapper.UserMapper;
import jb.studio.ground.grocerymarket.dto.auth.UserRegistrationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserRegisterService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional // 트랜잭션 관리
    public User registerUser(UserRegistrationRequest request) {
        // 이메일 중복 확인 (선택 사항: 필요하다면 추가)
        if (userMapper.selectUserByEmail(request.getEmail()) != null) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        // 비밀번호는 반드시 인코딩하여 저장
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setAddress(request.getAddress());

        // ✨ 핵심 수정: userType을 명시적으로 설정
        // DTO의 userType 기본값 "user"를 User 엔티티의 userType으로 설정
        // User 엔티티의 userType 필드가 String 타입이라고 가정합니다.
        // 만약 User 엔티티의 userType이 Role enum 타입이라면, Role.valueOf(request.getUserType().toUpperCase()) 사용
        newUser.setUserType(request.getUserType()); // DTO에서 넘어온 "user" 값을 그대로 사용

        // createdAt과 updatedAt은 DB의 DEFAULT CURRENT_TIMESTAMP에 의해 자동 설정되므로,
        // 여기서는 명시적으로 설정하지 않아도 됩니다.
        // 만약 DTO에 이 필드들이 있고, 이를 사용하고 싶다면 설정 가능합니다.
        // newUser.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        // newUser.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        userMapper.insertUser(newUser); // 사용자 정보 저장

        return newUser; // 저장된 사용자 객체 반환
    }
}