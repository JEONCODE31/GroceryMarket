// src/main/java/jb/studio/ground/grocerymarket/dto/order/OrderItemDto.java
package jb.studio.ground.grocerymarket.dto.auth.order;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private Long orderItemId;
    // private Long orderId; // API 응답에서는 보통 불필요

    private Long productId;
    private String productName; // 상품 이름 (DB 조인을 통해 가져옴)
    private String imageUrl; // 상품 이미지 URL (DB 조인을 통해 가져옴)
    private Integer quantity;
    private BigDecimal priceAtOrder;
}