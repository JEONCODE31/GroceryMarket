package jb.studio.ground.grocerymarket.service;

import jb.studio.ground.grocerymarket.domain.entity.Product;
import jb.studio.ground.grocerymarket.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List; // 추가된 import
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductRegisterService {

    private final ProductMapper productMapper;

    public void registerOrUpdateProduct(Product newProduct) {
        if(newProduct==null || !StringUtils.hasText(newProduct.getProductName())) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }

        Optional<Product> existingProductOpt = productMapper.findByProductName(newProduct.getProductName());

        if(existingProductOpt.isPresent()){
            Product existingProduct = existingProductOpt.get();
            // 기존 상품의 재고를 업데이트하는 로직은 그대로 유지
            productMapper.updateProductStock(existingProduct.getProductId(), existingProduct.getStockQuantity());
            System.out.println("기존 상품의 재고를 업데이트했습니다.");
        }
        else{
            productMapper.insertProduct(newProduct);
            System.out.println("새로운 상품을 등록하였습니다.");
        }
    }

    // 상품 ID로 상품을 조회하는 메서드 추가
    public Product getProductById(Integer productId) {
        return productMapper.findProductById(productId);
    }

    // 관리자 페이지를 위한 메서드 추가

    /**
     * 모든 상품 목록을 조회합니다.
     * @return 모든 상품 객체 목록
     */
    public List<Product> getAllProducts() {
        return productMapper.findAllProducts();
    }

    /**
     * 상품 재고를 업데이트합니다.
     * @param productId 재고를 변경할 상품의 ID
     * @param stockQuantity 새로 설정할 재고 수량
     */
    public void updateProductStock(Integer productId, Integer stockQuantity) {
        if (productId == null || stockQuantity == null || stockQuantity < 0) {
            throw new IllegalArgumentException("Invalid product ID or stock quantity.");
        }
        // 이 부분에서 상품 존재 여부 검증 후 업데이트를 수행하는 로직이 필요합니다.
        // 현재는 Mapper 호출만 가정합니다.
        productMapper.updateProductStock(productId, stockQuantity);
    }
}