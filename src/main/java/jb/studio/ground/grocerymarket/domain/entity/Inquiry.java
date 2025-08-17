package jb.studio.ground.grocerymarket.domain.entity;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Inquiry {
    private String id;
    private String title;
    private String content;
    private String userId;
    private String userName;
    private LocalDateTime createdAt;
    private String status; //답변대기|답변완료
    private String fileUrl;
    private String fileName;

}
