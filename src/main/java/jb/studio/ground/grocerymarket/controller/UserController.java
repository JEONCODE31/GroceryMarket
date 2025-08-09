// 예시: src/main/java/jb/studio/ground/grocerymarket/controller/UserController.java
package jb.studio.ground.grocerymarket.controller;

import jb.studio.ground.grocerymarket.domain.entity.User;
import jb.studio.ground.grocerymarket.mapper.UserMapper; // UserMapper 임포트
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/user") // 기본 경로 설정
@RequiredArgsConstructor // UserMapper 주입을 위해 추가
@Slf4j
public class UserController {

    private final UserMapper userMapper; // 사용자 정보를 조회하기 위해 UserMapper 주입

    // 로그인된 사용자의 프로필 정보를 반환하는 엔드포인트
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            // 토큰이 없거나 유효하지 않아 UserDetails를 가져올 수 없는 경우
            log.warn("프로필 요청 실패: 인증되지 않은 사용자");
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = userDetails.getUsername(); // UserDetails의 getUsername()은 이메일을 반환
        log.info("프로필 요청: 사용자 이메일 - {}", email);

        // 데이터베이스에서 사용자 정보 조회
        User user = userMapper.selectUserByEmail(email);

        if (user == null) {
            log.error("프로필 요청 실패: 데이터베이스에서 사용자 정보를 찾을 수 없음 - {}", email);
            return ResponseEntity.status(404).body("User profile not found.");
        }

        // 사용자 정보를 담을 DTO (예시)
        // 실제 필요한 필드만 포함하는 DTO를 별도로 정의하는 것이 좋습니다.
        class UserProfileResponse {
            public String email;
            public String username; // 실제 사용자 이름 필드 (Users 테이블의 username)
            // 필요하다면 다른 필드 추가 (예: phoneNumber, address 등)

            public UserProfileResponse(String email, String username) {
                this.email = email;
                this.username = username;
            }
        }

        // 조회된 사용자 정보로 응답 DTO 생성 및 반환
        return ResponseEntity.ok().body(new UserProfileResponse(user.getEmail(), user.getUsername()));
    }
}