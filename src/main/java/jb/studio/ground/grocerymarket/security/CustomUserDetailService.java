package jb.studio.ground.grocerymarket.security;

import jb.studio.ground.grocerymarket.domain.entity.User;
import jb.studio.ground.grocerymarket.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserMapper userMapper;

    /**
     * 사용자의 'username' (여기서는 이메일)을 기반으로 사용자 정보를 로드합니다.
     * @param email 사용자의 이메일 (로그인 시 사용되거나 JWT에서 추출된 값)
     * @return UserDetails 객체 (Spring Security가 사용자 정보를 이해하는 형식)
     * @throws UsernameNotFoundException 사용자를 찾을 수 없을 경우 발생
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. 데이터베이스에서 이메일을 통해 사용자 정보 조회
        User user = userMapper.selectUserByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // 2. 조회된 User 엔티티 정보를 CustomUserDetails 객체로 변환하여 반환
        // ✨ 이 부분만 수정하여 CustomUserDetails를 반환하도록 변경했습니다.
        return new CustomUserDetails(user);
    }
}