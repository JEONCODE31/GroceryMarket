// src/main/java/jb/studio/ground/grocerymarket/dto/user/UserProfileDto.java
package jb.studio.ground.grocerymarket.dto.auth.user;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data
public class UserProfileDto {

    @Id // 이 필드가 기본 키임을 명시
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키 값을 DB에 위임하여 자동 생성
    private Long userId;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String address;
    private String userType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // 비밀번호 필드는 절대 포함하지 않습니다.
}