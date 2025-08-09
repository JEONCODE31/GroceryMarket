// src/main/java/jb/studio/ground/grocerymarket/dto/cart/CartDto.java
package jb.studio.ground.grocerymarket.dto.auth.cart;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartItemDetailDto {
private Long productId;
private String productName;
private String imageUrl;
private BigDecimal price;
private int quantity;

}