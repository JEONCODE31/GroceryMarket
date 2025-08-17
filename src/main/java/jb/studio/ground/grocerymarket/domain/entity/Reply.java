package jb.studio.ground.grocerymarket.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor@NoArgsConstructor
public class Reply {
    private String id;
    private String inquiryId;
    private String userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;

    @JsonProperty("isUserComment")
    private boolean isUserComment;

    @JsonProperty("isReplyToAdmin")
    private boolean isReplyToAdmin;

    private String parentReplyId;
}
