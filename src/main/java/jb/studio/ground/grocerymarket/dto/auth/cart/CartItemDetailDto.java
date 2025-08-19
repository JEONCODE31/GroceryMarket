package jb.studio.ground.grocerymarket.dto.auth.cart;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemDetailDto {
    private Long cartItemId; // ⭐️ 이 줄을 추가합니다.
    private Long productId;
    private String productName;
    private String imageUrl;
    private BigDecimal price;
    private int quantity;
}