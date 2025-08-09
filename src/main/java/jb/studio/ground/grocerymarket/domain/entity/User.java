package jb.studio.ground.grocerymarket.domain.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor // 기본 생성자 자동 생성
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 자동 생성
public class User {
    private Long userId;
    private String username;
    private String password; // 암호화된 비밀번호
    private String email;
    private String phoneNumber;
    private String address;
    private String userType; // "customer" or "admin"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}