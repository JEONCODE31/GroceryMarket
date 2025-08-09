package jb.studio.ground.grocerymarket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    // 상품 ID 타입을 Long으로 유지
    private int productId;
    private String productName;
    // 카테고리 ID 타입을 Long으로 유지
    private Long categoryId;
    // 가격 타입을 BigDecimal로 유지
    private BigDecimal price;
    private Integer stockQuantity;
    private String productDescription;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
