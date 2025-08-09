package jb.studio.ground.grocerymarket.controller;

import jb.studio.ground.grocerymarket.domain.entity.User; // User 엔티티 임포트
import jb.studio.ground.grocerymarket.dto.auth.UserRegistrationRequest; // ✨ UserRegistrationRequest 임포트
import jb.studio.ground.grocerymarket.service.UserRegisterService;
import lombok.RequiredArgsConstructor; // Lombok의 RequiredArgsConstructor 임포트
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid; // ✨ @Valid 어노테이션 임포트

@RestController
@RequiredArgsConstructor // UserRegisterService 주입을 위한 Lombok 어노테이션
public class RegisterController {

    private final UserRegisterService userRegisterService;

    // 기존 생성자 대신 @RequiredArgsConstructor 사용 (Lombok)
    // public RegisterController(UserRegisterService userRegisterService) {
    //     this.userRegisterService = userRegisterService;
    // }

    @PostMapping("/register")
    // ✨ @RequestBody의 타입을 UserRegistrationRequest로 변경하고 @Valid 추가
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            if (request == null) {
                return ResponseEntity.badRequest().body("회원 정보가 없습니다.");
            }

            // ✨ userRegisterService.registerUser 메서드가 User 객체를 반환하도록 변경되었으므로,
            // 반환 값을 User 타입으로 받습니다.
            User registeredUser = userRegisterService.registerUser(request);

            // 회원가입 성공 여부 확인 (null이 아니면 성공으로 간주)
            if (registeredUser != null) {
                return ResponseEntity.ok("회원가입 성공"); // 또는 등록된 사용자 정보 반환
            } else {
                // 서비스에서 예외를 던지지 않고 null을 반환하는 경우를 대비 (일반적으로는 예외를 던지는 것이 좋음)
                return ResponseEntity.badRequest().body("회원가입 실패: 알 수 없는 오류");
            }

        } catch (IllegalArgumentException e) {
            // 서비스에서 던진 이메일 중복 등의 비즈니스 로직 예외 처리
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // 그 외 예상치 못한 서버 오류
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
}