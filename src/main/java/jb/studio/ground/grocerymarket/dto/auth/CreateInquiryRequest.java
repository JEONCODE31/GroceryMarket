package jb.studio.ground.grocerymarket.dto.auth;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class CreateInquiryRequest {
    @NotBlank private String title;
    @NotBlank private String content;
    @NotBlank private String userId;
    @NotBlank private String userName;
}
