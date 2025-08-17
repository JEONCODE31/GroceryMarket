package jb.studio.ground.grocerymarket.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateReplyRequest {
    @NotBlank
    private String content;

    // 작성자(요청에 없으면 서비스에서 로그인 사용자로 채움)
    private String authorId;
    private String authorName;

    // ⚠️ 필드명에 'is' 붙이지 마 — Lombok이 isIs... 게터를 만들어버림
    private boolean userComment;   // 사용자 댓글이면 true, 관리자 답변이면 false
    private boolean replyToAdmin;  // (선택) 특정 관리자에게 회신 플래그
    private String parentReplyId;  // (선택) 대댓글이면 부모 reply id
}
