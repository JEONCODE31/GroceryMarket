package jb.studio.ground.grocerymarket.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateInquiryRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String content;

    private String userId;
    private String userName;

    // 선택 파일 필드 (없으면 서비스에서 세팅 안 해도 됨)
    private String fileUrl;
    private String fileName;
}
