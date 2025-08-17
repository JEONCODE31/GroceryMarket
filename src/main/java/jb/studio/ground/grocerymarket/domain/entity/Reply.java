package jb.studio.ground.grocerymarket.domain.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Reply {
    private String id;
    private String inquiryId;
    private String userId;
    private String userName;
    private boolean replyToAdmin;  // ✅ 추가
    private String content;
    private boolean userComment;
    private String authorId;
    private String authorName;
    private LocalDateTime createdAt;
}
