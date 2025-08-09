package jb.studio.ground.grocerymarket.dto.auth;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class UserRegistrationRequest {
    @NotBlank(message = "사용자 이름은 필수입니다.")
    @Size(min = 3, max = 100, message = "사용자 이름은 3~100자여야 합니다.")
    private String username;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    private String password;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "유효한 이메일 형식이 아닙니다.")
    private String email;

    private String phoneNumber;
    private String address;
    private String userType = "user"; // 기본값
}
