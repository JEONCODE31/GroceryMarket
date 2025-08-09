// src/main/java/jb/studio/ground/grocerymarket/dto/cart/CartItemDto.java
package jb.studio.ground.grocerymarket.dto.auth.cart;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CartItemDto {
    private Long productId;
    private int quantity;
    private Long userId;
}