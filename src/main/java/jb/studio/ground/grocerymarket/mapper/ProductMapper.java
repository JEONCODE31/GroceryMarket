// package jb.studio.ground.grocerymarket.mapper;
package jb.studio.ground.grocerymarket.mapper;
import jb.studio.ground.grocerymarket.domain.entity.Category;
import jb.studio.ground.grocerymarket.domain.entity.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ProductMapper {
    void insertProduct(Product product);
    Optional<Product> findByProductName(String productName);

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

    // ⭐️ 수정된 부분: product_id를 productId로, 다른 컬럼들도 DTO와 일치하도록 수정
    @Select("SELECT productId, productName, categoryId, price, stockQuantity, isActive, productDescription, imageUrl FROM products")
    List<Product> findAllProducts();

    // 새롭게 추가하는 메서드: 상품 재고 업데이트
    void updateProductStock(Integer productId, Integer stockQuantity);
}