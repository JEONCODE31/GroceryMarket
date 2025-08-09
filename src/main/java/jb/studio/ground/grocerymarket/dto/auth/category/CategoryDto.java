// src/main/java/jb/studio/ground/grocerymarket/dto/category/CategoryDto.java
package jb.studio.ground.grocerymarket.dto.auth.category;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List; // 하위 카테고리 포함 시

@Data
public class CategoryDto {
    private Long categoryId;
    private String categoryName;
    private Long parentCategoryId;
    private Integer categoryLevel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // List<CategoryDto> children; // 계층 구조 표현 시 추가 가능
}