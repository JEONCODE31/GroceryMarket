package jb.studio.ground.grocerymarket.dto.auth;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class CreateReplyRequest {
    @NotBlank private String inquiryId;
    @NotBlank private String userId;
    @NotBlank private String userName;
    @NotBlank private String content;

    @JsonProperty("isUserComment")
    private boolean isUserComment;

    @JsonProperty("isReplyToAdmin")
    private boolean  isReplyToAdmin;

    private String parentReplyId;
}
