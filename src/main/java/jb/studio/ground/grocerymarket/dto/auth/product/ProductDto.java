// src/main/java/jb/studio/ground/grocerymarket/dto/product/ProductDto.java
package jb.studio.ground.grocerymarket.dto.auth.product;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

@Data
public class ProductDto {
    private Long productId; // 조회 시 사용, 생성/수정 시에는 보통 제외

    @NotBlank(message = "상품 이름은 필수입니다.")
    private String productName;

    @NotNull(message = "카테고리 ID는 필수입니다.")
    private Long categoryId;

    @NotNull(message = "가격은 필수입니다.")
    @DecimalMin(value = "0.01", message = "가격은 0.01 이상이어야 합니다.")
    private BigDecimal price;

    @NotNull(message = "재고 수량은 필수입니다.")
    @Min(value = 0, message = "재고 수량은 0 이상이어야 합니다.")
    private Integer stockQuantity;

    private String productDescription;
    private String imageUrl;
    private Boolean isActive;

    private LocalDateTime createdAt; // 응답 시에만 포함
    private LocalDateTime updatedAt; // 응답 시에만 포함
}