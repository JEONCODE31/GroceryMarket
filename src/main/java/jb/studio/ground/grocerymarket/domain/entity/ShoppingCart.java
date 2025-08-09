package jb.studio.ground.grocerymarket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCart {
    private Long cartId;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}