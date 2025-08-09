package jb.studio.ground.grocerymarket.domain.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    private Long categoryId; // Long 타입으로 변경 반영
    private String categoryName;
    private Long parentCategoryId; // 상위 카테고리 ID (nullable, Long 타입으로 변경 반영)
    private Integer categoryLevel;
    private Date createdAt;
    private Date updatedAt;
}