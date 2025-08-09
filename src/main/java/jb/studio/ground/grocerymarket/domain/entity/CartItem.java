package jb.studio.ground.grocerymarket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    // 데이터베이스 스키마와 일치하도록 타입을 Integer로 변경
    private Integer userId;
    private Integer productId;
    private Integer quantity;
    private LocalDateTime addedAt;
}
