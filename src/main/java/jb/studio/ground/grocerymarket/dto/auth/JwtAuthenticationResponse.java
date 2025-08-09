// src/main/java/jb/studio/ground/grocerymarket/dto/auth/JwtAuthenticationResponse.java
package jb.studio.ground.grocerymarket.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor; // 필요시 추가
import lombok.AllArgsConstructor; // 필요시 추가

@Data
@NoArgsConstructor
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    public JwtAuthenticationResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}