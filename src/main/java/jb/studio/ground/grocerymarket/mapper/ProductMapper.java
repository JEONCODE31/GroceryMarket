package jb.studio.ground.grocerymarket.mapper;

import jb.studio.ground.grocerymarket.domain.entity.Category;
import jb.studio.ground.grocerymarket.domain.entity.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ProductMapper {
    void insertProduct(Product product);
    Optional<Product> findByProductName(String productName);
    void updateProductStock(@Param("productId") Integer productId, @Param("stockQuantity") Integer stockQuantity);

    Product findProductById(@Param("productId") Integer productId);

    List<Product> findProductsByCategoryAndPagination(
            @Param("categoryIds") List<Long> categoryIds,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    List<Product> getProductsByIds(@Param("productIds")List<Integer> productIds);

    int countProductsByCategory(@Param("categoryIds") List<Long> categoryIds);

    Optional<Long> findCategoryIdByCategoryName(@Param("categoryName") String categoryName);

    List<Long> findChildCategoryIdsByParentId(@Param("parentCategoryId") Long parentCategoryId);

    // findAllCategories() 메서드 추가
    List<Category> findAllCategories();
}